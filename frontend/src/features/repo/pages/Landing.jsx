import React from "react";
import val from "../../../../public/val.png";

// Mock data based on applications.jpg
const applications = [
  {
    id: 1,
    name: "User Auth Service",
    repo: "sheryians/auth-service",
    status: "Deployed",
    time: "2m ago",
    version: "v1.2.3",
    color: "text-green-400",
  },
  {
    id: 2,
    name: "Frontend Web",
    repo: "sheryians/frontend-web",
    status: "Deployed",
    time: "15m ago",
    version: "v2.4.1",
    color: "text-green-400",
  },
  {
    id: 3,
    name: "Payment Service",
    repo: "sheryians/payment-service",
    status: "Failed",
    time: "1h ago",
    version: "v1.0.5",
    color: "text-red-500",
  },
  {
    id: 4,
    name: "Data Ingest Service",
    repo: "sheryians/data-ingest",
    status: "Running",
    time: "1h 20m ago",
    version: "v0.9.1",
    color: "text-yellow-400",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-['Press_Start_2P',cursive] selection:bg-yellow-500/30">
      {/* --- NAVIGATION (Vercel Style) --- */}
      <nav className="border-b border-white/10 px-8 py-4 flex justify-between items-center bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm shadow-[2px_2px_0px_#555]">
              <span className="text-black text-xs">▲</span>
            </div>
            <span className="text-lg font-bold tracking-tighter">VELORA</span>
          </div>
          <div className="hidden lg:flex gap-8 text-[10px] uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Templates</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-[10px] text-gray-400 uppercase hover:text-white">Log In</button>
          <button className="bg-white text-black px-4 py-2 text-[10px] font-bold border-b-4 border-gray-400 active:border-b-0 active:translate-y-1 transition-all">
            SIGN UP
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-20 px-6 border-b border-white/5">
        <div
          className="absolute inset-0 opacity-20 grayscale"
          style={{
            backgroundImage: `url(${val})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-block border rounded-full border-yellow-500/50 bg-yellow-500/10 px-4 py-1 mb-8">
            <span className="text-yellow-500 text-[10px] tracking-[0.1em] uppercase font-medium">
              v3.0.0 is now live 🚀
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-8 leading-tight mt-8">
            Develop. Preview. <br />
            <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Ship in Blocks.
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light">
            Velora provides the infrastructure to build a

          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="bg-white text-black px-12 py-5 text-sm font-bold shadow-[4px_4px_0px_#888] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              START DEPLOYING
            </button>
            <button className="bg-black border-2 border-white/20 text-white px-12 py-5 text-sm font-bold shadow-[4px_4px_0px_#333] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              READ THE DOCS
            </button>
          </div>
        </div>
      </section>

      {/* --- DASHBOARD PREVIEW --- */}
      <main className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Applications</h2>
            <p className="text-[#8b949e] text-[10px] mt-1 uppercase tracking-widest">
              Connected to GitHub
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#161b22] border border-white/10 px-4 py-2 text-[10px] w-full md:w-64 focus:outline-none focus:border-[#f1e05a]/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main List */}
          <div className="lg:col-span-3 space-y-2">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-[#161b22]/50 border border-white/5 p-4 flex items-center justify-between hover:border-white/20 hover:bg-[#161b22] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#0d1117] border border-white/10 flex items-center justify-center text-sm font-bold text-[#f1e05a]">
                    {app.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#e2e2e2] group-hover:text-white">
                      {app.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[9px] text-gray-500 mt-1">
                      <span>{app.repo}</span>
                      <span className="opacity-30">•</span>
                      <span>main</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <div className={`text-[9px] uppercase font-bold flex items-center justify-end gap-2 ${app.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${app.color.replace("text-", "bg-")} shadow-[0_0_5px_currentColor]`} />
                      {app.status}
                    </div>
                    <div className="text-[9px] text-gray-600 mt-0.5">{app.time}</div>
                  </div>
                  <div className="text-right min-w-[60px] hidden md:block">
                    <div className="text-[9px] text-gray-400 font-mono">{app.version}</div>
                    <div className="text-[9px] text-gray-600">3m 24s</div>
                  </div>
                  <button className="text-gray-600 hover:text-white">⋮</button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-4">
            <div className="bg-[#161b22] border border-white/10 p-4">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                {["Browse Templates", "Marketplace", "Usage Metrics"].map((item) => (
                  <div
                    key={item}
                    className="text-[10px] text-gray-500 hover:text-[#f1e05a] cursor-pointer flex justify-between group"
                  >
                    <span>{item}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f1e05a]/5 border border-[#f1e05a]/20 p-4">
              <p className="text-[9px] text-[#f1e05a] leading-relaxed">
                <span className="font-bold">SYSTEM STATUS:</span> <br />
                All systems functional. Global edge network is optimal.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 bg-black py-20 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] text-gray-600 tracking-widest uppercase">
            © 2026 DEPLOYPILOT INC. Crafted in Pixels.
          </div>
          <div className="flex gap-8 text-[10px] text-gray-500 uppercase tracking-widest">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">GitHub</a>
            <a href="#" className="hover:text-white">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
