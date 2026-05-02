import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      navigate("/login?error=auth_failed");
    }
  }, [searchParams, navigate]);

  return (
    <div className="h-screen bg-[#050505] flex items-center justify-center text-[#d1d1d1] font-['Minecraftia',monospace] text-sm">
      <div className="animate-pulse">
        Establishing secure connection...
        <br />
        Verifying OAuth token...
      </div>
    </div>
  );
}