import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({children}) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract token from URL if present (from GitHub OAuth)
  const queryParams = new URLSearchParams(location.search);
  const urlToken = queryParams.get('token');

  useEffect(() => {
    if (urlToken) {
      Cookies.set('token', urlToken, { expires: 30 }); // Save the token
      navigate(location.pathname, { replace: true }); // Clean the URL
    }
  }, [urlToken, navigate, location.pathname]);

  const token = Cookies.get('token') || urlToken;

  // If token is missing completely, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child routes
  return children;
};

export default ProtectedRoute;
