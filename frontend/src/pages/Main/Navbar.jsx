import { useState } from 'react'
import { Link } from 'react-router-dom'
import BrandLogo from '../../components/ui/BrandLogo'

export default function Navbar () {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Workflow', href: '#how-it-works' },
    { name: 'Deploy', href: '#ready-to-deploy' },
    { name: 'Docs', to: '/documentation' },
    { name: 'GitHub', href: 'https://github.com/vrushali-devlekar/Veloraa_deploy', external: true }
  ]

  return (
    // bg-transparent ensures the Hero image is visible behind it
    <nav className='top-0 left-0 right-0 z-50 bg-transparent relative'>
      {/* Subtle bottom border line */}
      <div className='absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent' />

      <div className='max-w-7xl mx-auto px-6 lg:px-12'>
        <div className='flex items-center justify-between h-20'>
          <div className='flex items-center gap-3'>
            <BrandLogo
              to="/"
              iconClassName="rounded-md"
              textClassName="text-white font-bold tracking-widest uppercase"
            />
          </div>

          <div className='hidden lg:flex items-center gap-10'>
            {navLinks.map(item => (
              item.to ? (
                <Link
                  key={item.name}
                  to={item.to}
                  className='text-gray-300 hover:text-white text-[11px] font-medium transition-colors duration-200 uppercase'
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className='text-gray-300 hover:text-white text-[11px] font-medium transition-colors duration-200 uppercase'
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {item.name}
                </a>
              )
            ))}
          </div>

          <div className='hidden md:flex items-center gap-4'>
            <Link 
              to="/login"
              className='text-white text-[11px] px-4 py-2 hover:text-[#a3e635] transition-colors uppercase font-mono'
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              className='bg-[#a3e635] text-black font-bold text-[11px] px-5 py-2 rounded-md hover:bg-[#bef264] transition-all uppercase font-mono'
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className='md:hidden text-gray-200 text-xs border border-white/20 rounded px-3 py-2 font-mono uppercase'
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {menuOpen && (
          <div className='md:hidden py-3 pb-5 flex flex-col gap-3 border-t border-white/10'>
            {navLinks.map((item) =>
              item.to ? (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className='text-gray-300 hover:text-white text-[11px] font-medium uppercase font-mono'
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className='text-gray-300 hover:text-white text-[11px] font-medium uppercase font-mono'
                >
                  {item.name}
                </a>
              )
            )}
            <Link to="/login" onClick={() => setMenuOpen(false)} className='text-gray-300 hover:text-white text-[11px] font-medium uppercase font-mono'>Sign In</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className='text-[#a3e635] hover:text-[#bef264] text-[11px] font-bold uppercase font-mono'>Get Started</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
