import React, { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Lazy loading all pages for God-level speed 🚀
const Landing = lazy(() => import("./pages/public/Landing"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Callback = lazy(() => import("./pages/auth/Callback"));
const Dashboard = lazy(() => import("./pages/main_dashboard/Dashboard"));
const Deployments = lazy(() => import("./pages/project_view/Deployments"));
const Projects = lazy(() => import("./pages/project_view/Projects"));
const Settings = lazy(() => import("./pages/project_view/Settings"));
const Environments = lazy(() => import("./pages/project_view/Environments"));
const DeploymentLogsPage = lazy(() => import("./pages/project_view/Terminal"));
const NewProjectPage = lazy(() => import("./pages/main_dashboard/NewProject"));
const Account = lazy(() => import("./pages/main_dashboard/Account"));
const Members = lazy(() => import("./pages/main_dashboard/Members"));
const Integrations = lazy(() => import("./pages/main_dashboard/Integrations"));
const LogsExplorer = lazy(() => import("./pages/main_dashboard/LogsExplorer"));
const DeploymentProgress = lazy(() => import("./pages/main_dashboard/DeploymentProgress"));
const Docs = lazy(() => import("./pages/Extra/Docs"));

import "./App.css";

// Loading Skeleton component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
    <div className="w-12 h-12 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
);

import ProtectedRoute from "./components/auth/ProtectedRoute";

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
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/projects/new",
    element: <ProtectedRoute><NewProjectPage /></ProtectedRoute>
  },
  {
    path: "/deploy",
    element: <ProtectedRoute><Deployments /></ProtectedRoute>
  },
  {
    path: "/deployment-progress/:projectId",
    element: <ProtectedRoute><DeploymentProgress /></ProtectedRoute>
  },
  {
    path: "/deploy/logs/:deploymentId",
    element: <ProtectedRoute><DeploymentLogsPage /></ProtectedRoute>
  },
  {
    path: "/applications",
    element: <ProtectedRoute><Projects /></ProtectedRoute>
  },
  {
    path: "/projects",
    element: <ProtectedRoute><Projects /></ProtectedRoute>
  },
  {
    path: "/environments",
    element: <ProtectedRoute><Environments /></ProtectedRoute>
  },
  {
    path: "/logs",
    element: <ProtectedRoute><LogsExplorer /></ProtectedRoute>
  },
  {
    path: "/history",
    element: <ProtectedRoute><Projects /></ProtectedRoute>
  },
  {
    path: "/settings",
    element: <ProtectedRoute><Settings /></ProtectedRoute>
  },
  {
    path: "/account",
    element: <ProtectedRoute><Account /></ProtectedRoute>
  },
  {
    path: "/members",
    element: <ProtectedRoute><Members /></ProtectedRoute>
  },
  {
    path: "/integrations",
    element: <ProtectedRoute><Integrations /></ProtectedRoute>
  },
  {
    path: "/documentation",
    element: <Docs />
  },
  {
    path: "*",
    element: <Navigate to="/" />, // 404 handling - redirect to landing
  }
]);

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
