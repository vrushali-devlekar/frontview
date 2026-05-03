import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const completeOAuth = async () => {
      const token = searchParams.get("token");
      if (token) {
        await login(null, token);
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login?error=auth_failed", { replace: true });
      }
    };

    void completeOAuth();
  }, [searchParams, navigate, login]);

  return (
    <div className="h-screen bg-[#09090b] flex flex-col items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-[#22c55e] flex items-center justify-center animate-pulse">
          <Zap size={20} className="text-black" strokeWidth={3} />
        </div>
        <div className="text-center">
          <p className="text-[14px] font-medium text-white mb-1">Authenticating</p>
          <p className="text-[13px] text-[#71717a]">Please wait while we verify your session...</p>
        </div>
      </div>
    </div>
  );
}
