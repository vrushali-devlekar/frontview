import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const PublicRoute = () => {
  const token = Cookies.get('token');

  // If token exists (user is logged in), redirect to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the child routes (e.g. login, register, landing)
  return <Outlet />;
};

export default PublicRoute;
