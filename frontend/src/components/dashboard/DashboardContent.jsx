import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const DashboardContent = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: isCollapsed ? '72px' : '280px' }}>
        <TopNav />
        <main className="flex-1 overflow-y-auto p-8">
          {/* Dashboard content goes here */}
          <h1 className="text-2xl font-bold text-white">Welcome to Dashboard</h1>
        </main>
      </div>
    </div>
  );
};

export default DashboardContent;
// remove the overview,deploy,pipeline,infrastructure,and plus buttons from navbar, just keep the bell icon,search icon, mail box icon,help icon