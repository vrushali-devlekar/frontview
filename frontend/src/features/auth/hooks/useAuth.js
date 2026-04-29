import { useSelector, useDispatch } from 'react-redux';
import { login, register, logout, reset, setCredentials } from '../state/auth.slice';
import { useCallback } from 'react';
import { authApi } from '../services/auth.api';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  const { user, token, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  const loginUser = useCallback((userData) => {
    return dispatch(login(userData));
  }, [dispatch]);

  const registerUser = useCallback((userData) => {
    return dispatch(register(userData));
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    return dispatch(logout());
  }, [dispatch]);

  const resetAuth = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

  const manuallySetCredentials = useCallback((credentials) => {
    dispatch(setCredentials(credentials));
  }, [dispatch]);

  const loginWithGithub = useCallback(() => {
    authApi.loginWithGithub();
  }, []);

  return {
    user,
    token,
    isError,
    isSuccess,
    isLoading,
    message,
    loginUser,
    registerUser,
    logoutUser,
    resetAuth,
    manuallySetCredentials,
    loginWithGithub,
  };
};
