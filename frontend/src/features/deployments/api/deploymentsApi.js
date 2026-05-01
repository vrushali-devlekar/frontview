import api from '../../../api/api';

export const triggerDeployment = async (projectId) => {
  const { data } = await api.post('/deployments', { projectId });
  return data;
};

export const getDeploymentStatus = async (deploymentId) => {
  const { data } = await api.get(`/deployments/${deploymentId}`);
  return data;
};

export const stopDeployment = async (deploymentId) => {
  const { data } = await api.post(`/deployments/${deploymentId}/stop`);
  return data;
};

export const analyzeDeploymentLogs = async (deploymentId, provider) => {
  const { data } = await api.post(`/deployments/${deploymentId}/analyze-logs`, {
    provider,
  });
  return data;
};
