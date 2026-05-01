import React from "react";
import { Twitter, Github, Disc as Discord, Youtube } from "lucide-react";

// Import assets - update these paths to match your folder structure
import footerBg from "../../assets/bg-top.png"; // Your image with the character
import logoImg from "../../assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    // {
    //   title: "PRODUCT",
    //   links: ["Features", "Pricing", "Changelog", "Status"],
    // },
    {
      title: "RESOURCES",
      links: ["Docs", "Guides", "API Reference", "Blog"],
    },
    {
      title: "COMPANY",
      links: ["About", "Careers", "Contact", "Press"],
    },
    {
      title: "LEGAL",
      links: ["Privacy", "Terms", "Security"],
    },
  ];

  return (
    <footer className="relative w-full bg-black text-white font-press-start overflow-hidden border-t border-gray-900">
      {/* BACKGROUND IMAGE WITH PRECISE POSITIONING */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat opacity-50"
        style={{ 
            backgroundImage: `url(${footerBg})`,
            backgroundPosition: 'right center' // Keeps the pixel art character visible
        }}
      >
        {/* Darkening overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 py-12 md:px-12">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          
          {/* 1. LOGO AND BRANDING */}
          <div className="lg:w-1/4 space-y-6 pr-8 border-r border-gray-800/50">
            <div className="flex items-center gap-3 text-lg font-bold tracking-tighter uppercase text-[#facc15]">
              <img
                src={logoImg}
                alt="Velora"
                className="h-8 w-auto object-contain"
              />
              VELORA
            </div>

            <div className="space-y-4">
              <p className="text-[10px] text-[#facc15] uppercase tracking-wider">
                Deploy. Scale. Relax.
              </p>
              <p className="text-[9px] leading-loose text-gray-500 uppercase">
                The deployment platform for modern developers. No complexity.
                Just speed, reliability and control.
              </p>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex gap-5 text-gray-400">
              <Github size={16} className="hover:text-white cursor-pointer transition-colors" />
              <Twitter size={16} className="hover:text-white cursor-pointer transition-colors" />
              <Discord size={16} className="hover:text-white cursor-pointer transition-colors" />
              <Youtube size={16} className="hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* 2. DYNAMIC LINK COLUMNS WITH SEPARATORS */}
          <div className="lg:w-3/4 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="space-y-6 md:border-l md:border-gray-800/50 md:pl-8">
                <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-[9px] text-gray-400 hover:text-[#facc15] transition-colors uppercase block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 3. BOTTOM COPYRIGHT */}
        <div className="mt-16 pt-6 border-t border-gray-900/50">
          <p className="text-[8px] text-gray-600 uppercase tracking-widest">
            © {currentYear} Velora Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* FLOATING RETRO TEXT (Optional extra from your design) */}
      <div className="hidden xl:block absolute right-16 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <h3 className="text-xl text-[#facc15] font-black leading-none uppercase italic border border-[#facc15]/20 p-4">
          DEPLOY<br />SCALE<br />RELAX
        </h3>
      </div>
    </footer>
  );
};

export default Footer;