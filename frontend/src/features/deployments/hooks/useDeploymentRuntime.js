import { useCallback, useMemo, useState } from 'react';
import {
  getDeploymentStatus,
  stopDeployment,
  triggerDeployment,
} from '../api/deploymentsApi';

const normalizeStatus = (status) => String(status || '').toUpperCase();

const toTimelineItem = (deployment) => ({
  id: deployment._id,
  status: normalizeStatus(deployment.status || 'queued'),
  branch: deployment.branch || '-',
  commit: deployment.commitHash?.slice(0, 7) || '-',
  duration: deployment.deploymentDuration
    ? `${deployment.deploymentDuration}s`
    : '-',
  timestamp: deployment.startedAt
    ? new Date(deployment.startedAt).toLocaleTimeString()
    : 'just now',
  error: deployment.errorMessage,
  raw: deployment,
});

export const useDeploymentRuntime = () => {
  const [deployments, setDeployments] = useState([]);
  const [selectedDeploymentId, setSelectedDeploymentId] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [error, setError] = useState('');

  const selectedDeployment = useMemo(
    () => deployments.find((entry) => entry.id === selectedDeploymentId) || null,
    [deployments, selectedDeploymentId]
  );

  const upsertDeployment = useCallback((deploymentDoc) => {
    const nextItem = toTimelineItem(deploymentDoc);
    setDeployments((current) => {
      const alreadyExists = current.some((entry) => entry.id === nextItem.id);
      if (alreadyExists) {
        return current.map((entry) => (entry.id === nextItem.id ? nextItem : entry));
      }
      return [nextItem, ...current];
    });
  }, []);

  const startDeployment = useCallback(async () => {
    if (!projectId.trim()) {
      setError('Project ID is required to trigger deployment.');
      return null;
    }

    setError('');
    setIsTriggering(true);
    try {
      const response = await triggerDeployment(projectId.trim());
      if (response?.deploymentId) {
        setSelectedDeploymentId(response.deploymentId);
      }
      return response?.deploymentId || null;
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Failed to trigger deployment.');
      return null;
    } finally {
      setIsTriggering(false);
    }
  }, [projectId]);

  const refreshDeployment = useCallback(
    async (deploymentId) => {
      if (!deploymentId) return null;

      setIsLoadingStatus(true);
      try {
        const response = await getDeploymentStatus(deploymentId);
        if (response?.data) {
          upsertDeployment(response.data);
        }
        return response?.data || null;
      } catch (apiError) {
        setError(apiError?.response?.data?.message || 'Failed to load deployment status.');
        return null;
      } finally {
        setIsLoadingStatus(false);
      }
    },
    [upsertDeployment]
  );

  const stopActiveDeployment = useCallback(
    async (deploymentId) => {
      if (!deploymentId) return false;

      setIsStopping(true);
      setError('');
      try {
        await stopDeployment(deploymentId);
        await refreshDeployment(deploymentId);
        return true;
      } catch (apiError) {
        setError(apiError?.response?.data?.message || 'Failed to stop deployment.');
        return false;
      } finally {
        setIsStopping(false);
      }
    },
    [refreshDeployment]
  );

  return {
    deployments,
    selectedDeployment,
    selectedDeploymentId,
    projectId,
    isTriggering,
    isStopping,
    isLoadingStatus,
    error,
    setProjectId,
    setSelectedDeploymentId,
    startDeployment,
    refreshDeployment,
    stopActiveDeployment,
  };
};
