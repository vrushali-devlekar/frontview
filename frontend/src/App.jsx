<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
import React from "react";
<<<<<<< HEAD
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
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
<<<<<<< HEAD
import DeploymentLogsPage from "./pages/project_view/Terminal";
import NewProjectPage from "./pages/main_dashboard/NewProject";
import Account from "./pages/main_dashboard/Account";
import Members from "./pages/main_dashboard/Members";
import Integrations from "./pages/main_dashboard/Integrations";
import Docs from "./pages/Extra/Docs";
=======
<<<<<<< HEAD
<<<<<<< HEAD
import DeploymentLogsPage from "./pages/project_view/Terminal";
import NewProjectPage from "./pages/main_dashboard/NewProject";
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7

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
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
    path: "/projects/new",
    element: <NewProjectPage />
  },
  {
<<<<<<< HEAD
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
    path: "/deploy",
    element: <Deployments />
  },
  {
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
    path: "/deploy/logs/:deploymentId",
    element: <DeploymentLogsPage />
  },
  {
<<<<<<< HEAD
=======
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
>>>>>>> 5b94c478ee6b62a623140273e09b191633b41eb7
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
    path: "/members",
    element: <Members />
  },
  {
    path: "/integrations",
    element: <Integrations />
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
  return <RouterProvider router={router} />;
};

export default App;
