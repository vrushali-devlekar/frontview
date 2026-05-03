import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "../pages/Landing.js";
import Login from "../auth/Login.jsx";
import Register from "../auth/Register.js";
import DashboardContent from "../components/dashboard/DashboardContent.jsx";
import Applications from "../components/ActiveLinks/Applications.jsx";
import Environments from "../components/ActiveLinks/Environments.jsx";
import DeploymentsPage from "../components/ActiveLinks/DeploymentsPage.js";
import Settings from "../components/ActiveLinks/Settings.js";
import Metrics from "../components/ActiveLinks/Metrics.js";
import DeploymentLogsPage from "../components/ActiveLinks/DeploymentLogsPage.js";

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
    element: <DashboardContent />
  },
  {
    path: "/deploy",
    element: <DeploymentsPage />
  },
  {
    path: "/applications",
    element: <Applications />
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
    path: 'deployments',
    element: <DeploymentLogsPage />
  },
  {
    path: "*",
    element: <Navigate to="/" />, // 404 handling - redirect to landing
  }
]);
