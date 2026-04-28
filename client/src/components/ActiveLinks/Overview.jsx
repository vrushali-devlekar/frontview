import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Rocket, RotateCcw, ShieldCheck, Settings } from 'lucide-react';

// Sample Data for the Chart
const data = [
  { name: 'Mon', value: 5 },
  { name: 'Tue', value: 12 },
  { name: 'Wed', value: 24 },
  { name: 'Thu', value: 8 },
  { name: 'Fri', value: 18 },
  { name: 'Sat', value: 10 },
  { name: 'Sun', value: 20 },
];

const Overview = () => {
  return (
    <div className="p-6 bg-[#0a0a0a] min-h-screen font-mono text-[var(--color-velora-text)] space-y-6">
      <h2 className="text-xl tracking-widest uppercase mb-4">Dashboard Overview</h2>

      {/* Top Grid: Main Chart and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Chart Card */}
        <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm tracking-tight text-gray-400 uppercase">Deployment Frequency (7 days)</h3>
            <span className="text-[10px] text-gray-500">TOTAL DEPLOYS: 142</span>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }}
                  itemStyle={{ color: '#2dd4bf' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
           <h3 className="text-sm tracking-tight text-gray-400 uppercase self-start mb-4">System Health</h3>
           <div className="relative w-48 h-48">
              {/* Simple Semi-circle SVG for Health Gauge */}
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#222" strokeWidth="8" />
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#2dd4bf" strokeWidth="8" strokeDasharray="100" strokeDashoffset="2" className="drop-shadow-[0_0_8px_#2dd4bf]" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
                <span className="text-4xl font-bold text-[#2dd4bf] tracking-tighter">98%</span>
                <span className="text-[10px] text-green-500 mt-1 uppercase">Optimal</span>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Grid: Active Apps and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Applications Table */}
        <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm tracking-tight text-gray-400 uppercase mb-4">Active Applications</h3>
          <div className="space-y-4">
            {['Payments Service', 'User Auth', 'Data Ingest', 'Process Service'].map((app) => (
              <div key={app} className="flex items-center justify-between group hover:bg-white/5 p-2 rounded transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                  <span className="text-sm">{app}</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-24 h-4 bg-gray-900 rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-teal-500/20 animate-pulse" style={{ width: '70%' }} />
                   </div>
                   <button className="opacity-0 group-hover:opacity-100 transition-opacity"><Settings size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-[#111] border border-gray-800 rounded-xl p-6">
          <h3 className="text-sm tracking-tight text-gray-400 uppercase mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <button className="flex flex-col items-center gap-2 p-3 border border-gray-800 rounded-lg hover:border-gray-500 transition-colors">
              <Rocket size={20} className="text-gray-400" />
              <span className="text-[10px] uppercase">New Deploy</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 border border-gray-800 rounded-lg hover:border-gray-500 transition-colors">
              <RotateCcw size={20} className="text-gray-400" />
              <span className="text-[10px] uppercase">Rollback</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 border border-gray-800 rounded-lg hover:border-gray-500 transition-colors">
              <ShieldCheck size={20} className="text-gray-400" />
              <span className="text-[10px] uppercase">Secrets</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 border border-gray-800 rounded-lg hover:border-gray-500 transition-colors">
              <Settings size={20} className="text-gray-400" />
              <span className="text-[10px] uppercase">Settings</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Overview;