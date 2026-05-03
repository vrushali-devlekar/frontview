import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Terminal } from "lucide-react";
import api from "../../api/api";
import CyberButton from "../../components/ui/CyberButton";
import InputField from "../../components/ui/InputField";

<<<<<<< HEAD
import { githubAuthUrl, googleAuthUrl } from "../../api/api";

=======
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = () => {
<<<<<<< HEAD
    window.location.href = githubAuthUrl;
  };

  const handleGoogleLogin = () => {
    window.location.href = googleAuthUrl;
=======
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
>>>>>>> e8413a855b5e22591d64a2a348db30b019e104b4
  };

  return (
    <div className="min-h-screen bg-valora-bg flex items-center justify-center p-4 font-mono select-none">
      <div className="w-full max-w-md bg-valora-card border-2 border-valora-border shadow-[8px_8px_0px_0px_rgba(255,204,0,0.15)] p-8 relative overflow-hidden">
        {/* Yellow Accent Corner */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-valora-yellow"></div>

        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4 text-valora-yellow">
            <Terminal size={40} />
          </div>
          <h1 className="font-pixel text-valora-yellow text-xl mb-2">WELCOME_BACK</h1>
          <p className="text-[10px] text-[#888] tracking-widest uppercase">AUTHENTICATION_REQUIRED</p>
        </div>

        {/* Social Login */}
        <div className="flex flex-col gap-3 mb-6">
          <CyberButton onClick={handleGithubLogin} variant="outline" className="w-full">
            <svg height="14" width="14" viewBox="0 0 16 16" fill="currentColor" className="mr-2">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            CONTINUE_WITH_GITHUB
          </CyberButton>
          <CyberButton onClick={handleGoogleLogin} variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 24 24" width="14" className="mr-2">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            CONTINUE_WITH_GOOGLE
          </CyberButton>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-[#333]"></div>
          <span className="text-[10px] text-[#555] uppercase">OR_LOCAL_AUTH</span>
          <div className="flex-1 h-[1px] bg-[#333]"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <InputField 
            label="USER_EMAIL" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="operator@valora.io" 
            required 
          />

          <InputField 
            label="SYS_PASSWORD" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            required 
          />

          {error && (
            <div className="text-valora-red text-[10px] border border-valora-red/30 bg-valora-red/10 p-2 text-center uppercase">
              [!] {error}
            </div>
          )}

          <CyberButton type="submit" disabled={loading} variant="primary" className="w-full mt-4 font-pixel tracking-wider">
            {loading ? "AUTHENTICATING..." : "INITIATE_LOGIN"}
          </CyberButton>
        </form>

        <div className="mt-8 text-center text-[10px] text-[#666] uppercase">
          NO_ACCOUNT_FOUND?{' '}
          <Link to="/register" className="text-valora-cyan hover:underline">
            REGISTER_NEW_NODE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;