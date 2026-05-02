import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import Landing from "./pages/public/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Callback from "./pages/auth/Callback";
import Dashboard from "./pages/main_dashboard/Dashboard";
import Deployments from "./pages/project_view/Deployments";
import Overview from "./pages/project_view/Overview";
import Metrics from "./pages/project_view/Metrics";
import Settings from "./pages/project_view/Settings";
import Environments from "./pages/project_view/Environments";
import Account from "./pages/main_dashboard/Account";

import "./App.css";

const router = createBrowserRouter([
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
    path: "/auth/success",
    element: <Callback />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/deploy",
    element: <Deployments />
  },
  {
    path: "/applications",
    element: <Overview />
  },
  {
    path: "/environments",
    element: <Environments />
  },
  {
    path: "/metrics",
    element: <Metrics />
  },
  {
    path: "/settings",
    element: <Settings />
  },
  {
    path: "/account",
    element: <Account />
  },
  {
    path: "*",
    element: <Navigate to="/" />, // 404 handling - redirect to landing
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
