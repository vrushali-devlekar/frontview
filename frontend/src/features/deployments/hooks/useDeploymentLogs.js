import { useEffect, useMemo, useState } from 'react';
import { subscribeDeploymentLogs } from '../api/deploymentSocket';

const parsePersistedLog = (logLine, index) => {
  const matched = /^\[([^\]]+)\]\s\[(\w+)\]\s([\s\S]+)$/.exec(logLine || '');
  if (!matched) {
    return {
      id: `persisted-${index}`,
      time: '--:--:--',
      level: 'info',
      message: logLine,
    };
  }

  const [, timestamp, level, message] = matched;
  return {
    id: `persisted-${index}`,
    time: new Date(timestamp).toLocaleTimeString(),
    level: level.toLowerCase(),
    message,
  };
};

export const useDeploymentLogs = (deploymentId, persistedLogs = [], options = {}) => {
  const [streamedLogsByDeployment, setStreamedLogsByDeployment] = useState({});
  const [isCompletedByDeployment, setIsCompletedByDeployment] = useState({});
  const [streamError, setStreamError] = useState('');

  useEffect(() => {
    if (!deploymentId) return () => {};

    const unsubscribe = subscribeDeploymentLogs(deploymentId, {
      onLogLine: (payload) => {
        setStreamedLogsByDeployment((current) => {
          const existing = current[deploymentId] || [];
          const nextLog = {
            id: `live-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            time: new Date(payload?.timestamp || Date.now()).toLocaleTimeString(),
            level: payload?.level || 'info',
            message: payload?.message || '',
          };
          return {
            ...current,
            [deploymentId]: [...existing, nextLog].slice(-5000),
          };
        });
      },
      onComplete: (payload) => {
        setIsCompletedByDeployment((current) => ({
          ...current,
          [deploymentId]: true,
        }));
        setStreamedLogsByDeployment((current) => {
          const existing = current[deploymentId] || [];
          const completionLog = {
            id: `complete-${Date.now()}`,
            time: new Date(payload?.timestamp || Date.now()).toLocaleTimeString(),
            level: 'success',
            message: payload?.message || 'Deployment process completed.',
          };
          return {
            ...current,
            [deploymentId]: [...existing, completionLog].slice(-5000),
          };
        });

        options?.onComplete?.(payload);
      },
      onError: (error) => {
        setStreamError(error?.message || 'Socket connection failed.');
      },
    });

    return () => {
      unsubscribe();
    };
  }, [deploymentId]);

  const allLogs = useMemo(() => {
    const parsedPersisted = persistedLogs.map((entry, index) =>
      parsePersistedLog(entry, index)
    );
    const streamedLogs = streamedLogsByDeployment[deploymentId] || [];
    return [...parsedPersisted, ...streamedLogs].slice(-5000);
  }, [deploymentId, persistedLogs, streamedLogsByDeployment]);

  const isStreaming = Boolean(deploymentId) && !isCompletedByDeployment[deploymentId];

  return {
    logs: allLogs,
    streamError,
    isStreaming,
  };
};
