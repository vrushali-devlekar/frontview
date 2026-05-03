const footerLinks = {
  Product: ["Features", "Pricing", "Changelog", "Status"],
  Resources: ["Documentation", "Guides", "API Reference", "Blog"],
  Company: ["About Us", "Careers", "Contact"],
};

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="w-7 h-7 relative flex-shrink-0">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="4" y="4" width="10" height="10" fill="#39ff14" />
        <rect x="18" y="4" width="10" height="10" fill="#39ff14" opacity="0.6" />
        <rect x="4" y="18" width="10" height="10" fill="#39ff14" opacity="0.6" />
        <rect x="18" y="18" width="10" height="10" fill="#39ff14" />
      </svg>
    </div>
    <span
      className="text-white font-black uppercase tracking-widest"
      style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "12px" }}
    >
      Velora
    </span>
  </div>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.129 18.11a19.9 19.9 0 005.993 3.03.077.077 0 00.084-.028 14.09 14.09 0 001.226-1.994.075.075 0 00-.041-.104 13.201 13.201 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-[#39ff14]/10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-gray-500 text-xs mt-4 leading-relaxed max-w-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
              Deploy modern apps with speed, security, and simplicity.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 mt-6">
              {[
                { icon: <GithubIcon />, label: "GitHub" },
                { icon: <TwitterIcon />, label: "Twitter" },
                { icon: <DiscordIcon />, label: "Discord" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="text-gray-500 hover:text-[#39ff14] transition-colors duration-300 hover:drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4
                className="text-white text-xs font-bold uppercase tracking-widest mb-5"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 hover:text-[#39ff14] text-xs transition-colors duration-200"
                      style={{ fontFamily: "'Space Mono', monospace" }}
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

      {/* Bottom bar */}
      <div className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
            © 2025 Velora. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-gray-600 text-xs" style={{ fontFamily: "'Space Mono', monospace" }}>
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>by Velora Team</span>
          </div>
          <a
            href="#"
            className="text-gray-600 hover:text-[#39ff14] text-xs transition-colors duration-200"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            velora.dev
          </a>
        </div>
      </div>
    </footer>
  );
}
