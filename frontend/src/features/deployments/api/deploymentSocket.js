import { io } from 'socket.io-client';
import { API_BASE_URL } from '../../../api/api.js';

const socketBaseUrl = API_BASE_URL.replace(/\/api$/, '');

let socketInstance;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(socketBaseUrl, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket', 'polling'],
    });
  }

  return socketInstance;
};

export const subscribeDeploymentLogs = (deploymentId, handlers) => {
  if (!deploymentId) return () => {};

  const socket = getSocket();
  const roomId = String(deploymentId);

  socket.emit('join:deployment', roomId);

  const onLogLine = (payload) => handlers?.onLogLine?.(payload);
  const onComplete = (payload) => handlers?.onComplete?.(payload);
  const onConnectError = (error) => handlers?.onError?.(error);

  socket.on('log:line', onLogLine);
  socket.on('log:complete', onComplete);
  socket.on('connect_error', onConnectError);

  return () => {
    socket.emit('leave:deployment', roomId);
    socket.off('log:line', onLogLine);
    socket.off('log:complete', onComplete);
    socket.off('connect_error', onConnectError);
  };
};
