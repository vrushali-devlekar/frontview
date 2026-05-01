import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../auth/Login";
import Register from "../auth/Register";
import DashboardContent from "../components/dashboard/DashboardContent";
import DeploymentsLogspage from "../components/ActiveLinks/DeploymentsPage";
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
    element: <DashboardContent />,
  },
  {
    path: "*",
    element: <Navigate to="/" />, // 404 handling - redirect to landing
  },
  {
    path: "/deployments",
    element: <DeploymentsLogspage/> // Deployments Page
  },
  
]);
