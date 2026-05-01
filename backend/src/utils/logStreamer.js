// utils/logStreamer.js
const Deployment = require('../models/Deployment');

const persistLogLine = async (deploymentId, level, message) => {
    const entry = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;

    try {
        await Deployment.updateOne(
            { _id: deploymentId },
            {
                $push: {
                    logs: {
                        $each: [entry],
                        $slice: -5000
                    }
                }
            }
        );
    } catch (error) {
        console.error(`Failed to persist log for deployment ${deploymentId}:`, error.message);
    }
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

            persistLogLine(deploymentId, 'info', line);
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

            persistLogLine(deploymentId, 'error', line);
        });
    });

    // Jab process khatam ho jaye
    childProcess.on('close', (code) => {
        if (io) {
            io.to(roomName).emit('log:complete', {
                timestamp: new Date(),
                message: `Process exited with code ${code}`
            });
        }
    });
};

module.exports = { streamLogs };