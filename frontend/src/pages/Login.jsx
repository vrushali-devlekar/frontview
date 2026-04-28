import React from "react";
import val from "../assets/val.png";

const Login = () => {
  return (
    /* Change 1: Force height to 100vh and hide global scroll */
    <div className="h-screen overflow-hidden bg-[#050505] text-[#d1d1d1] font-['Minecraftia',monospace] flex flex-col lg:flex-row">
      
      {/* LEFT SIDE: Brand & Mood (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-12 overflow-hidden border-r border-white/5">
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center grayscale contrast-125"
          style={{
            backgroundImage: `url(${val})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <div className="relative z-20 text-center max-w-md">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-[#f1e05a] flex items-center justify-center rounded-sm shadow-[4px_4px_0px_#8a7b2e]">
              <span className="text-black text-2xl">▲</span>
            </div>
          </div>
          <h1 className="text-6xl font-bold tracking-widest text-white mb-4 uppercase">
            Velora
          </h1>
          <p className="text-[#8b949e] text-sm uppercase tracking-[0.2em] mb-8 border-y border-white/10 py-2">
            Production-Grade DevOps Panel
          </p>
          <p className="text-gray-400 leading-relaxed text-sm">
            Connect your code. Automate deployments.
            <br />
            Ship faster, worry less.
          </p>
        </div>

        <div className="absolute bottom-10 left-10 z-20 bg-white/5 border border-white/10 p-4 backdrop-blur-sm flex items-center gap-4">
          <div className="text-green-500 text-xl">🛡️</div>
          <div className="text-[10px] uppercase tracking-tighter text-gray-500">
            Secure. Encrypted. Reliable.
            <br />
            <span className="text-gray-300">Built for developers.</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      {/* Change 2: Allow ONLY this side to scroll if the screen is too small */}
      <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="lg:hidden absolute inset-0 z-0 opacity-10 bg-[url('veloraimg.jpg')] bg-cover bg-center grayscale"></div>

        <div className="w-full max-w-md relative z-10 py-8"> {/* Added py-8 for breathing room on small screens */}
          <div className="bg-[#0d0f11] border border-white/10 p-8 md:p-10 shadow-2xl rounded-sm">
            <header className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-[11px] uppercase tracking-wider">
                Login to your Velora account
              </p>
            </header>

            <button className="w-full bg-[#f1e05a] text-black py-4 flex items-center justify-center gap-3 font-bold text-sm border-b-4 border-[#8a7b2e] active:border-b-0 active:translate-y-[4px] transition-all mb-8">
              <span className="text-xl"></span>
              CONTINUE WITH GITHUB
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-white/5"></div>
              <span className="text-[10px] text-gray-600 uppercase">or</span>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-2 tracking-widest">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">✉</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full bg-[#050505] border border-white/10 p-4 pl-12 text-sm focus:outline-none focus:border-[#f1e05a]/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-2 tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">🔒</span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-[#050505] border border-white/10 p-4 pl-12 text-sm focus:outline-none focus:border-[#f1e05a]/50 transition-colors"
                  />
                </div>
                <div className="text-right mt-2">
                  <a href="#" className="text-[10px] text-gray-600 hover:text-[#f1e05a] uppercase">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button className="w-full bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 py-4 text-sm font-bold border-b-4 border-[#1a7a0a] hover:bg-[#39ff14]/20 transition-all uppercase tracking-widest mt-4">
                Login to Panel
              </button>
            </form>
          </div>

          <div className="mt-10 text-center space-y-4">
            <p className="text-[9px] text-gray-700 uppercase tracking-widest">
              © 2026 Velora. All rights reserved.
            </p>
            <div className="flex justify-center gap-6 text-[9px] text-gray-600 uppercase tracking-widest">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <span className="opacity-20">•</span>
              <a href="#" className="hover:text-white">Terms</a>
              <span className="opacity-20">•</span>
              <a href="#" className="hover:text-white">Docs</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;