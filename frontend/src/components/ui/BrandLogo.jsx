import React from "react";
import { Link } from "react-router-dom";
import logoClose from "../../assets/logo-close.png";

export default function BrandLogo({
  to = "/dashboard",
  compact = false,
  className = "",
  textClassName = "",
  iconClassName = "",
  imgClassName = "",
}) {
  return (
    <Link to={to} className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center ${iconClassName}`}>
        <img src={logoClose} alt="Velora Logo" className={`w-full h-full object-cover ${imgClassName}`} />
      </div>
      {!compact && (
        <span
          className={`text-white font-bold tracking-widest uppercase ${textClassName}`}
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "14px" }}
        >
          Velora
        </span>
      )}
    </Link>
  );
}
