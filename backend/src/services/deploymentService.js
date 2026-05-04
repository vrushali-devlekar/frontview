const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const Project = require('../models/Project');
const Deployment = require('../models/Deployment');
const User = require('../models/User');
const Integration = require('../models/Integration');
const { cloneRepo } = require('./fsManager');
const { getAvailablePort, releasePort } = require('../utils/portManager');
const { detectFramework } = require('../utils/frameworkDetector');
const { streamLogs } = require('../utils/logStreamer');
const { decrypt } = require('../utils/crypto');
const { notifyIntegrations } = require('./notificationService');

const activeProcesses = new Map();

const appendLog = async (deploymentId, level, message, io, logType = 'build') => {
  const entry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
  const targetField = logType === 'runtime' ? 'runtimeLogs' : 'buildLogs';

  await Deployment.updateOne(
    { _id: deploymentId },
    {
      $push: {
        logs: { $each: [entry], $slice: -5000 },
        [targetField]: { $each: [entry], $slice: -5000 }
      }
    }
  );

  if (io) {
    io.to(`dep:${deploymentId}`).emit('log:line', {
      timestamp: new Date(),
      level,
      message,
      logType
    });
  }
};

const runShellCommand = (command, cwd, deploymentId, io, logType = 'build') =>
  new Promise((resolve, reject) => {
    const child = spawn(command, { cwd, shell: true, env: process.env });
    activeProcesses.set(String(deploymentId), child);
    streamLogs(String(deploymentId), child, io, logType);

    child.on('close', (code) => {
      activeProcesses.delete(String(deploymentId));
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} failed with exit code ${code}`));
    });

    child.on('error', (err) => {
      activeProcesses.delete(String(deploymentId));
      reject(err);
    });
  });

const waitForHttpReady = async (port, timeoutMs = 25000, intervalMs = 800) => {
  const started = Date.now();
  const target = `http://127.0.0.1:${port}/`;

  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(target, { method: 'GET', redirect: 'manual' });
      if (response.status < 500) {
        return;
      }
    } catch (_) {
      // Retry
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(`Application did not become ready on port ${port}`);
};

const writeDeploymentEnv = async (project, targetPath) => {
  const integrations = await Integration.find({ projectId: project._id, isActive: true });
  let envContent = '';

  if (Array.isArray(project.envVars)) {
    for (const env of project.envVars) {
      try {
        const decrypted = decrypt(env.encryptedValue, env.iv);
        envContent += `${env.key}="${decrypted}"\n`;
      } catch (_) {
        // Skip invalid encrypted entry
      }
    }
  }

  for (const integration of integrations) {
    const config = Object.fromEntries(integration.config || []);
    if (integration.provider === 'mongodb' && config.uri) {
      envContent += `MONGODB_URI="${config.uri}"\n`;
      envContent += `MONGO_URL="${config.uri}"\n`;
    }
    if (integration.provider === 'redis' && config.uri) {
      envContent += `REDIS_URL="${config.uri}"\n`;
    }
  }

  if (!envContent.trim()) return false;
  await fs.writeFile(path.join(targetPath, '.env'), envContent, 'utf8');
  return true;
};

const executeDeployment = async (deploymentId, io) => {
  let deployment = null;
  let assignedPort = null;

  try {
    deployment = await Deployment.findById(deploymentId);
    if (!deployment) throw new Error('Deployment record not found');

    const project = await Project.findById(deployment.projectId);
    if (!project) throw new Error('Project not found');

    deployment.status = 'building';
    deployment.startedAt = deployment.startedAt || new Date();
    await deployment.save();
    io?.to(`dep:${deploymentId}`).emit('deployment:status', { status: 'building' });
    await appendLog(deploymentId, 'info', 'Deployment started', io);

    let targetPath;
    if (project.deploymentSource === 'upload') {
      targetPath = path.join(__dirname, '../../deployments_temp', String(deployment._id));
      await appendLog(deploymentId, 'info', 'Using uploaded source files', io);
    } else {
      const user = await User.findById(deployment.userId).select('+githubAccessToken');
      targetPath = await cloneRepo(
        project.repoUrl,
        String(deployment._id),
        project.branch || 'main',
        user?.githubAccessToken || null
      );
      await appendLog(deploymentId, 'info', `Repository cloned to ${targetPath}`, io);
    }

    const envWritten = await writeDeploymentEnv(project, targetPath);
    await appendLog(deploymentId, 'info', envWritten ? 'Environment variables injected' : 'No environment variables found', io);

    await appendLog(deploymentId, 'info', 'Analyzing repository structure', io);
    const frameworkInfo = await detectFramework(targetPath);
    if (frameworkInfo.error) throw new Error(frameworkInfo.error);

    const appPath = frameworkInfo.projectPath || targetPath;
    await appendLog(deploymentId, 'info', `Detected framework: ${frameworkInfo.type}`, io);

    if (frameworkInfo.installCmd) {
      await appendLog(deploymentId, 'info', `Running install command: ${frameworkInfo.installCmd}`, io);
      await runShellCommand(frameworkInfo.installCmd, appPath, deploymentId, io, 'build');
      await appendLog(deploymentId, 'info', 'Install completed', io);
    } else {
      await appendLog(deploymentId, 'info', 'Install step skipped', io);
    }

    if (frameworkInfo.buildCmd) {
      await appendLog(deploymentId, 'info', `Running build command: ${frameworkInfo.buildCmd}`, io);
      await runShellCommand(frameworkInfo.buildCmd, appPath, deploymentId, io, 'build');
      await appendLog(deploymentId, 'info', 'Build completed', io);
    }

    assignedPort = getAvailablePort();
    const startCmd = frameworkInfo.startCmd.replace('$PORT', String(assignedPort));
    await appendLog(deploymentId, 'info', `Starting application on port ${assignedPort}`, io);
    await appendLog(deploymentId, 'info', `Start command launched: ${startCmd}`, io, 'runtime');

    const appProcess = spawn(startCmd, {
      cwd: appPath,
      shell: true,
      env: { ...process.env, PORT: String(assignedPort) }
    });

    activeProcesses.set(String(deploymentId), appProcess);
    streamLogs(String(deploymentId), appProcess, io, 'runtime');

    appProcess.on('close', async (code, signal) => {
      const latest = await Deployment.findById(deploymentId);
      activeProcesses.delete(String(deploymentId));
      if (!latest) return;

      if (latest.port) releasePort(latest.port);

      if (latest.status === 'stopped') return;

      latest.completedAt = new Date();
      if (code === 0) {
        latest.status = 'stopped';
        await appendLog(deploymentId, 'info', `Process exited normally (code 0${signal ? `, signal ${signal}` : ''})`, io, 'runtime');
      } else {
        latest.status = 'failed';
        latest.errorMessage = `Process exited unexpectedly (code ${code}${signal ? `, signal ${signal}` : ''})`;
        await appendLog(deploymentId, 'error', latest.errorMessage, io, 'runtime');
      }
      await latest.save();
      io?.to(`dep:${deploymentId}`).emit('deployment:status', { status: latest.status });
    });

    await waitForHttpReady(assignedPort);

    deployment = await Deployment.findById(deploymentId);
    deployment.status = 'running';
    deployment.port = assignedPort;
    await deployment.save();
    io?.to(`dep:${deploymentId}`).emit('deployment:status', { status: 'running', url: deployment.url });
    await appendLog(deploymentId, 'info', `Deployment live at ${deployment.url || `http://localhost:${assignedPort}`}`, io, 'runtime');

    project.activeDeploymentId = deployment._id;
    await project.save();

    notifyIntegrations(project._id, { ...deployment.toObject(), projectName: project.name }, 'success')
      .catch(() => {});
  } catch (error) {
    if (assignedPort) releasePort(assignedPort);
    activeProcesses.delete(String(deploymentId));

    if (deployment) {
      deployment.status = 'failed';
      deployment.errorMessage = error.message;
      deployment.completedAt = new Date();
      await deployment.save();
      await appendLog(deploymentId, 'error', `Deployment failed: ${error.message}`, io);
      io?.to(`dep:${deploymentId}`).emit('deployment:status', { status: 'failed' });
    }
  }
};

const stopDeployment = async (deploymentId) => {
  const key = String(deploymentId);
  const running = activeProcesses.get(key);

  if (running && running.pid) {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/PID', String(running.pid), '/T', '/F'], { windowsHide: true });
    } else {
      running.kill('SIGTERM');
    }
    activeProcesses.delete(key);
  }

  const deployment = await Deployment.findById(deploymentId);
  if (!deployment) return;

  if (deployment.port) {
    releasePort(deployment.port);
  }

  deployment.status = 'stopped';
  deployment.completedAt = new Date();
  await deployment.save();
};

const executeRollback = async (newDeploymentId, oldDeploymentId, io) => {
  let rollback = null;
  let assignedPort = null;

  try {
    rollback = await Deployment.findById(newDeploymentId);
    const oldDeployment = await Deployment.findById(oldDeploymentId);
    if (!rollback || !oldDeployment) throw new Error('Rollback deployment not found');

    const project = await Project.findById(rollback.projectId);
    if (!project) throw new Error('Project not found');

    await appendLog(newDeploymentId, 'info', `Rollback started. Target deployment: ${oldDeploymentId}`, io);

    const oldPath = path.join(__dirname, '../../deployments_temp', String(oldDeployment._id));
    const frameworkInfo = await detectFramework(oldPath);
    if (frameworkInfo.error) throw new Error(frameworkInfo.error);

    assignedPort = getAvailablePort();
    const startCmd = frameworkInfo.startCmd.replace('$PORT', String(assignedPort));
    const processRef = spawn(startCmd, {
      cwd: frameworkInfo.projectPath || oldPath,
      shell: true,
      env: { ...process.env, PORT: String(assignedPort) }
    });

    activeProcesses.set(String(newDeploymentId), processRef);
    streamLogs(String(newDeploymentId), processRef, io, 'runtime');
    await waitForHttpReady(assignedPort);

    rollback.status = 'running';
    rollback.port = assignedPort;
    await rollback.save();

    project.activeDeploymentId = rollback._id;
    await project.save();

    await appendLog(newDeploymentId, 'info', `Rollback successful. Live at ${rollback.url || `http://localhost:${assignedPort}`}`, io, 'runtime');
  } catch (error) {
    if (assignedPort) releasePort(assignedPort);
    if (rollback) {
      rollback.status = 'failed';
      rollback.errorMessage = error.message;
      rollback.completedAt = new Date();
      await rollback.save();
      await appendLog(newDeploymentId, 'error', `Rollback failed: ${error.message}`, io);
    }
  }
};

module.exports = { executeDeployment, stopDeployment, executeRollback };
