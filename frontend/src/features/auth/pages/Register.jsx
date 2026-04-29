import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import val from "../../../../public/val.png";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { username, email, password } = formData;
  
  const navigate = useNavigate();
  const { registerUser, isLoading, isError, isSuccess, message, resetAuth, user, loginWithGithub, token } = useAuth();

  useEffect(() => {
    if (isError) {
      // Optional: handle error with toast
    }

    if (isSuccess || user || token) {
      navigate("/dashboard"); // Navigate to dashboard on success
    }

    resetAuth();
  }, [user, token, isError, isSuccess, message, navigate, resetAuth]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { username, email, password };
    registerUser(userData);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#050505] text-[#d1d1d1] font-['Minecraftia',monospace] flex flex-col lg:flex-row">
      
      {/* LEFT SIDE: Image (Condensed spacing) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center p-8 overflow-hidden border-r border-white/5">
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center grayscale contrast-125"
          style={{ backgroundImage: `url(${val})` }}
        ></div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        <div className="relative z-20 text-center max-w-sm">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 bg-[#39ff14] flex items-center justify-center rounded-sm shadow-[3px_3px_0px_#1a7a0a]">
              <span className="text-black text-xl">▲</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-widest text-white mb-2 uppercase">VELORA</h1>
          <p className="text-[#8b949e] text-[10px] uppercase tracking-[0.2em] mb-4 border-y border-white/10 py-1">
            Join the elite builders
          </p>
          <p className="text-gray-400 text-xs px-6">
            Start your journey today. Create, deploy, and scale with ease.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Form (Condensed) */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 relative bg-[#050505]">
        <div className="w-full max-w-md relative z-10">
          
          {/* Main Card: Reduced padding from p-10 to p-6 */}
          <div className="bg-[#0d0f11] border border-white/10 p-6 md:p-8 shadow-2xl rounded-sm">
            <header className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1">Create Account</h2>
              <p className="text-gray-500 text-[9px] uppercase tracking-wider">Start building with Velora</p>
            </header>

            {/* Social Login: Smaller padding */}
            <button 
              onClick={loginWithGithub}
              type="button"
              className="w-full bg-[#f1e05a] text-black py-3 flex items-center justify-center gap-3 font-bold text-[11px] border-b-4 border-[#8a7b2e] active:border-b-0 active:translate-y-[2px] transition-all mb-6 uppercase"
            >
              <span className="text-lg"></span> Sign up with GitHub
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-[1px] bg-white/5"></div>
              <span className="text-[9px] text-gray-600 uppercase">or</span>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              {message && isError && (
                 <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] p-2 text-center uppercase tracking-widest">
                   {message}
                 </div>
              )}
              <div className="grid grid-cols-1 gap-3">
                {/* Username */}
                <div>
                  <label className="block text-[9px] uppercase text-gray-500 mb-1 tracking-widest">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChange}
                    placeholder="SteveCraft"
                    className="w-full bg-[#050505] border border-white/10 p-3 text-[11px] focus:outline-none focus:border-[#39ff14]/50"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[9px] uppercase text-gray-500 mb-1 tracking-widest">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="steve@velora.io"
                    className="w-full bg-[#050505] border border-white/10 p-3 text-[11px] focus:outline-none focus:border-[#39ff14]/50"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[9px] uppercase text-gray-500 mb-1 tracking-widest">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="••••••••"
                    className="w-full bg-[#050505] border border-white/10 p-3 text-[11px] focus:outline-none focus:border-[#39ff14]/50"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading} 
                className="w-full bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 py-3 text-[11px] font-bold border-b-4 border-[#1a7a0a] hover:bg-[#39ff14]/20 transition-all uppercase tracking-widest mt-4 disabled:opacity-50"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <footer className="mt-6 text-center">
              <p className="text-[9px] text-gray-500 uppercase">
                Already a builder? <a href="/login" className="text-[#f1e05a] hover:underline ml-1">Login</a>
              </p>
            </footer>
          </div>

          {/* Minimalist Bottom Links */}
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

export default Register;