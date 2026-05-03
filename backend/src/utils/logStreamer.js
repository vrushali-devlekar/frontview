// utils/logStreamer.js
const Deployment = require('../models/Deployment');
const pendingLogFlushes = new Map();

const flushBufferedLogs = async (deploymentId) => {
    const state = pendingLogFlushes.get(deploymentId);
    if (!state || state.entries.length === 0) {
        return;
    }

    const entries = state.entries.splice(0, state.entries.length);
    try {
        await Deployment.updateOne(
            { _id: deploymentId },
            {
                $push: {
                    logs: {
                        $each: entries,
                        $slice: -5000
                    }
                }
            }
        );
    } catch (error) {
        console.error(`Failed to persist logs for deployment ${deploymentId}:`, error.message);
    }
};

const queueLogPersistence = (deploymentId, level, message) => {
    const entry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;
    const key = deploymentId.toString();
    const state = pendingLogFlushes.get(key) || { entries: [], timer: null };

    state.entries.push(entry);

    if (state.timer) {
        pendingLogFlushes.set(key, state);
        return;
    }

    state.timer = setTimeout(async () => {
        const activeState = pendingLogFlushes.get(key);
        if (!activeState) {
            return;
        }

        activeState.timer = null;
        await flushBufferedLogs(key);

        if (!activeState.timer && activeState.entries.length === 0) {
            pendingLogFlushes.delete(key);
        }
    }, 200);

    pendingLogFlushes.set(key, state);
};

const streamLogs = (deploymentId, childProcess, io) => {
    const roomName = `dep:${deploymentId}`;

    // Normal Logs (STDOUT)
    childProcess.stdout.on('data', (data) => {
        const logLines = data.toString().split('\n').filter(line => line.trim() !== '');
        
        logLines.forEach(line => {
            if (io) {
                io.to(roomName).emit('log:line', {
                    timestamp: new Date(),
                    level: 'info',
                    message: line
                });
            }

            queueLogPersistence(deploymentId, 'info', line);
        });
    });

    // Error Logs (STDERR)
    childProcess.stderr.on('data', (data) => {
        const logLines = data.toString().split('\n').filter(line => line.trim() !== '');
        
        logLines.forEach(line => {
            if (io) {
                io.to(roomName).emit('log:line', {
                    timestamp: new Date(),
                    level: 'error',
                    message: line
                });
            }

            queueLogPersistence(deploymentId, 'error', line);
        });
    });

    // Jab process khatam ho jaye
    childProcess.on('close', (code) => {
        const key = deploymentId.toString();
        const state = pendingLogFlushes.get(key);
        if (state?.timer) {
            clearTimeout(state.timer);
            state.timer = null;
        }
        void flushBufferedLogs(key).finally(() => {
            const latest = pendingLogFlushes.get(key);
            if (latest && !latest.timer && latest.entries.length === 0) {
                pendingLogFlushes.delete(key);
            }
        });

        if (io) {
            io.to(roomName).emit('log:complete', {
                timestamp: new Date(),
                message: `Process exited with code ${code}`
            });
        }
    });
};

module.exports = { streamLogs };
