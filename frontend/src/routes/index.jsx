import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />, // Public Landing Page
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },

  {
    path: "*",
    element: <Navigate to="/" />, // 404 handling - redirect to landing
  },
]);
