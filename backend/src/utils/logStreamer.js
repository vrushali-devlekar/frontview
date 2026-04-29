// utils/logStreamer.js
const streamLogs = (deploymentId, childProcess, io) => {
    const roomName = `dep:${deploymentId}`;

    // Normal Logs (STDOUT)
    childProcess.stdout.on('data', (data) => {
        const logLines = data.toString().split('\n').filter(line => line.trim() !== '');
        
        logLines.forEach(line => {
            io.to(roomName).emit('log:line', {
                timestamp: new Date(),
                level: 'info',
                message: line
            });
        });
    });

    // Error Logs (STDERR)
    childProcess.stderr.on('data', (data) => {
        const logLines = data.toString().split('\n').filter(line => line.trim() !== '');
        
        logLines.forEach(line => {
            io.to(roomName).emit('log:line', {
                timestamp: new Date(),
                level: 'error',
                message: line
            });
        });
    });

    // Jab process khatam ho jaye
    childProcess.on('close', (code) => {
        io.to(roomName).emit('log:complete', {
            timestamp: new Date(),
            message: `Process exited with code ${code}`
        });
    });
};

module.exports = { streamLogs };