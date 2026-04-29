import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Rocket, RotateCcw, ShieldCheck, Settings } from 'lucide-react';
import bgCity from '../../assets/bg-city.png';

// Sample Data for the Chart
const data = [
  { name: 'Mon', value: 5 },
  { name: 'Tue', value: 10 },
  { name: 'Wed', value: 25 },
  { name: 'Thu', value: 8 },
  { name: 'Fri', value: 19 },
  { name: 'Sat', value: 10 },
  { name: 'Sun', value: 21 },
];

const Overview = () => {
  return (
    <div className="relative p-6 md:p-8 min-h-screen text-[var(--color-velora-text)] space-y-6 flex flex-col font-sans z-0">

      {/* Background Image for the upper area */}
      <div
        className="absolute top-0 left-0 right-0 h-[300px] md:h-[400px] -z-10 bg-no-repeat bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url(${bgCity})`,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-velora-bg)]" />
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4 relative">
        <h2 className="text-xl md:text-2xl tracking-widest uppercase drop-shadow-[0_0_8px_rgba(224,216,190,0.5)]">Dashboard Overview</h2>
      </div>

      {/* Top Grid: Main Chart and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Large Chart Card */}
        <div className="lg:col-span-2 bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] md:text-xs tracking-tight uppercase text-[var(--color-velora-text)]">Deployment Frequency (7 days)</h3>
            <span className="text-[8px] text-[var(--color-velora-text)] opacity-70">TOTAL DEPLOYS: 142</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E0D8BE" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#E0D8BE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 4" stroke="#40403a" vertical={false} />
                <XAxis dataKey="name" stroke="#60605a" fontSize={8} tickLine={false} axisLine={false} tick={{ fill: '#E0D8BE', fontSize: 8 }} dy={10} />
                <YAxis stroke="#60605a" fontSize={8} tickLine={false} axisLine={false} tick={{ fill: '#E0D8BE', fontSize: 8 }} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-velora-sidebar)', border: '1px solid #40403a', color: '#E0D8BE', fontFamily: 'inherit', fontSize: '10px' }}
                  itemStyle={{ color: '#E0D8BE' }}
                />
                <Area type="monotone" dataKey="value" stroke="#E0D8BE" strokeWidth={2} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-6 flex flex-col relative shadow-lg">
          <h3 className="text-[10px] md:text-xs tracking-tight uppercase text-[var(--color-velora-text)] mb-8">System Health</h3>
          <div className="flex-grow flex items-center justify-center mt-4">
            <div className="relative w-full h-48 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <path d="M 10 45 A 35 35 0 0 1 90 45" fill="none" stroke="#2a2a25" strokeWidth="8" strokeLinecap="butt" />
                <path d="M 10 45 A 35 35 0 0 1 90 45" fill="none" stroke="#E0D8BE" strokeWidth="8" strokeDasharray="110" strokeDashoffset="15" strokeLinecap="butt" className="drop-shadow-[0_0_2px_rgba(224,216,190,0.3)]" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className="text-3xl md:text-4xl text-[var(--color-velora-text)] drop-shadow-[0_0_3px_rgba(224,216,190,0.4)]">98%</span>
                <span className="text-[10px] text-[var(--color-velora-text)] mt-3 uppercase opacity-80">Optimal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Active Apps and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Active Applications Table */}
        <div className="lg:col-span-2 bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-6 shadow-lg">
          <h3 className="text-[10px] md:text-xs tracking-tight uppercase text-[var(--color-velora-text)] mb-8">Active Applications</h3>
          <div className="space-y-6">
            {[
              { name: 'Payments Service', active: 3 },
              { name: 'User Auth', active: 4 },
              { name: 'Data Ingest', active: 3 },
              { name: 'Process Service', active: 3 }
            ].map((app) => (
              <div key={app.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full border border-[#40403a] flex items-center justify-center bg-[var(--color-velora-sidebar)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-velora-text)] drop-shadow-[0_0_4px_rgba(224,216,190,0.8)]" />
                  </div>
                  <span className="text-[10px] uppercase text-[var(--color-velora-text)] opacity-90">{app.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`h-3 w-8 md:w-12 ${i < app.active ? 'bg-[var(--color-velora-text)] opacity-70' : 'bg-[#2a2a25]'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-[var(--color-velora-sidebar)] border border-[#40403a] rounded-xl p-6 shadow-lg">
          <h3 className="text-[10px] md:text-xs tracking-tight uppercase text-[var(--color-velora-text)] mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 h-[calc(100%-2.5rem)]">
            <button className="flex flex-col items-center justify-center gap-3 p-3 border border-[#40403a] rounded-lg hover:bg-[var(--color-velora-text)]/10 hover:border-[#E0D8BE] transition-colors">
              <Rocket size={20} className="text-[var(--color-velora-text)]" />
              <span className="text-[8px] uppercase text-[var(--color-velora-text)]">New Deploy</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-3 border border-[#40403a] rounded-lg hover:bg-[var(--color-velora-text)]/10 hover:border-[#E0D8BE] transition-colors">
              <RotateCcw size={20} className="text-[var(--color-velora-text)]" />
              <span className="text-[8px] uppercase text-[var(--color-velora-text)]">Rollback</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-3 border border-[#40403a] rounded-lg hover:bg-[var(--color-velora-text)]/10 hover:border-[#E0D8BE] transition-colors">
              <ShieldCheck size={20} className="text-[var(--color-velora-text)]" />
              <span className="text-[8px] uppercase text-[var(--color-velora-text)]">Secrets</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 p-3 border border-[#40403a] rounded-lg hover:bg-[var(--color-velora-text)]/10 hover:border-[#E0D8BE] transition-colors">
              <Settings size={20} className="text-[var(--color-velora-text)]" />
              <span className="text-[8px] uppercase text-[var(--color-velora-text)]">Settings</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;