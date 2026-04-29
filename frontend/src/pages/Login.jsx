import React from "react";
import val from "../assets/val.png";

const Login = () => {
  return (
    /* h-screen + overflow-hidden prevents global page scrolling */
    <div className="h-screen overflow-hidden bg-[#050505] text-[#d1d1d1] font-['Minecraftia',monospace] flex flex-col lg:flex-row">
      
      {/* LEFT SIDE: Brand & Mood */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-8 overflow-hidden border-r border-white/5">
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center grayscale contrast-125"
          style={{
            backgroundImage: `url(${val})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <div className="relative z-20 text-center max-w-sm">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 bg-[#f1e05a] flex items-center justify-center rounded-sm shadow-[3px_3px_0px_#8a7b2e]">
              <span className="text-black text-xl">▲</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-widest text-white mb-2 uppercase">
            Velora
          </h1>
          <p className="text-[#8b949e] text-[10px] uppercase tracking-[0.2em] mb-4 border-y border-white/10 py-1">
            Production-Grade DevOps Panel
          </p>
          <p className="text-gray-400 text-xs px-6">
            Connect your code. Automate deployments. <br />
            Ship faster, worry less.
          </p>
        </div>

        {/* Secure Badge */}
        <div className="absolute bottom-6 left-6 z-20 bg-white/5 border border-white/10 p-3 backdrop-blur-sm flex items-center gap-3">
          <div className="text-green-500 text-lg">🛡️</div>
          <div className="text-[8px] uppercase tracking-tighter text-gray-500 leading-tight">
            Secure. Encrypted. Reliable.<br />
            <span className="text-gray-300">Built for developers.</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form (Compact & Centered) */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center p-4 md:p-8 relative">
        {/* Mobile Background Hint */}
        <div className="lg:hidden absolute inset-0 z-0 opacity-10 bg-cover bg-center grayscale" style={{ backgroundImage: `url(${val})` }}></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#0d0f11] border border-white/10 p-6 md:p-8 shadow-2xl rounded-sm">
            <header className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-[9px] uppercase tracking-wider">
                Login to your Velora account
              </p>
            </header>

            {/* Social Login - Compact */}
            <button className="w-full bg-[#f1e05a] text-black py-3 flex items-center justify-center gap-3 font-bold text-[11px] border-b-4 border-[#8a7b2e] active:border-b-0 active:translate-y-[2px] transition-all mb-6 uppercase">
              <span className="text-lg"></span>
              Continue with GitHub
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-[1px] bg-white/5"></div>
              <span className="text-[9px] text-gray-600 uppercase">or</span>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            {/* Form - Condensed spacing */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[9px] uppercase text-gray-500 mb-1 tracking-widest">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">✉</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-[#050505] border border-white/10 p-3 pl-10 text-[11px] focus:outline-none focus:border-[#f1e05a]/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase text-gray-500 mb-1 tracking-widest">Password</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-[#050505] border border-white/10 p-3 pl-10 text-[11px] focus:outline-none focus:border-[#f1e05a]/50 transition-colors"
                  />
                </div>
                <div className="text-right mt-1.5">
                  <a href="#" className="text-[9px] text-gray-600 hover:text-[#f1e05a] uppercase">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button className="w-full bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 py-3 text-[11px] font-bold border-b-4 border-[#1a7a0a] hover:bg-[#39ff14]/20 transition-all uppercase tracking-widest mt-2">
                Login to Panel
              </button>
            </form>

            <footer className="mt-6 text-center">
              <p className="text-[9px] text-gray-500 uppercase">
                Don't have an account?{" "}
                <a href="/register" className="text-[#f1e05a] hover:underline ml-1">
                  Sign up
                </a>
              </p>
            </footer>
          </div>
          
          {/* Bottom links */}
          <div className="mt-6 text-center flex justify-center gap-4 text-[8px] text-gray-600 uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;