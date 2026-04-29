import { createBrowserRouter, Navigate } from "react-router-dom";
import Landing from "../features/repo/pages/Landing";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Logout from "../features/auth/pages/Logout";
import DashboardContent from "../features/repo/pages/DashboardContent";
import DeploymentsPage from "../features/repo/pages/DeploymentsPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

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
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/deployment",
    element: (
      <ProtectedRoute>
        <DeploymentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" />, // 404 handling - redirect to landing
  },
]);
