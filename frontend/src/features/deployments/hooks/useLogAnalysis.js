import { useCallback, useState } from 'react';
import { analyzeDeploymentLogs } from '../api/deploymentsApi';

export const PROVIDERS = ['gemini', 'mistral', 'cohere'];

export const useLogAnalysis = () => {
  const [provider, setProvider] = useState(PROVIDERS[0]);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const runAnalysis = async (deploymentId) => {
    if (!deploymentId) return null;

    setError('');
    setIsAnalyzing(true);
    try {
      const response = await analyzeDeploymentLogs(deploymentId, provider);
      setAnalysis(response?.data || null);
      return response?.data || null;
    } catch (apiError) {
      setAnalysis(null);
      setError(apiError?.response?.data?.message || 'Failed to analyze logs.');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = useCallback(() => {
    setAnalysis(null);
    setError('');
  }, []);

  return {
    provider,
    analysis,
    isAnalyzing,
    error,
    setProvider,
    runAnalysis,
    resetAnalysis,
  };
};
