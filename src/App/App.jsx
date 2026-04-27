import React, { useState } from 'react';
import Sidebar from "../components/dashboard/Sidebar";
import TopNav from '../components/dashboard/TopNav';
import DashboardContent from '../components/dashboard/DashboardContent';

const App = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-velora-bg)] relative">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col h-screen overflow-hidden w-full transition-[margin] duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-[72px]' : 'ml-[72px] md:ml-[280px]'}`}>
        <TopNav />
        <DashboardContent />
      </div>
    </div>
  );
};

export default App;