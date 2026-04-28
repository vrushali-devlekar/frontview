import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import TopNav from "../components/dashboard/TopNav";
import DashboardContent from "../components/dashboard/DashboardContent";

import Pipelines from "../components/ActiveLinks/Pipelines";
import DeploymentsPage from "../components/ActiveLinks/DeploymentsPage";

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-[var(--color-velora-bg)] relative">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        <div
          className={`flex-1 flex flex-col h-screen overflow-hidden w-full transition-[margin] duration-300 ease-in-out ${
            isSidebarCollapsed ? "ml-[72px]" : "ml-[72px] md:ml-[280px]"
          }`}
        >
          <TopNav />

          {/* Main Content Area - Yahan Routes aayenge */}
          <div className="flex-1 overflow-auto">
            <Routes>
              {/* Default Home Page */}
              <Route path="/" element={<DashboardContent />} />

              {/* Pipeline Page */}
              <Route path="/pipelines" element={<Pipelines />} />
              <Route path="/deploy" element={<DeploymentsPage />} />

              {/* Add more routes here as you build them */}
              <Route
                path="/applications"
                element={<div>Applications Page Coming Soon</div>}
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
