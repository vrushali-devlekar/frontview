import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthSuccess() {
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
    <div className="h-screen bg-[#050505] flex items-center justify-center text-white">
      <p>Logging you in...</p>
    </div>
  );
}
