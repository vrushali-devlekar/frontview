import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar () {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navLinks = [
    { name: 'Features', href: '#' },
    { name: 'Docs', href: '/documentation' },
    { name: 'Pricing', href: '#' },
    { name: 'GitHub', href: 'https://github.com' },
    { name: 'Changelog', href: '#' }
  ]

  return (
    // bg-transparent ensures the Hero image is visible behind it
    <nav className='top-0 left-0 right-0 z-50 bg-transparent'>
      {/* Subtle bottom border line */}
      <div className='absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent' />

      <div className='max-w-7xl mx-auto px-6 lg:px-12'>
        <div className='flex items-center justify-between h-20'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 flex items-center justify-center'>
              <svg viewBox='0 0 40 40' className='w-full h-full fill-[#a3e635]'>
                <path d='M20 5L5 15V25L20 35L35 25V15L20 5ZM18 28L10 20L12 18L18 24L28 14L30 16L18 28Z' />
              </svg>
            </div>
            <Link
              to='/'
              className='text-white font-bold tracking-widest uppercase'
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '14px'
              }}
            >
              Velora
            </Link>
          </div>

          <div className='hidden lg:flex items-center gap-10'>
            {navLinks.map(item => (
              <a
                key={item.name}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                className='text-gray-300 hover:text-white text-[11px] font-medium transition-colors duration-200 uppercase'
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className='hidden md:flex items-center gap-4'>
            <button
              onClick={() => navigate('/login')}
              className='text-white text-[11px] px-4 py-2 hover:text-[#a3e635] transition-colors uppercase font-mono'
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className='bg-[#a3e635] text-black font-bold text-[11px] px-5 py-2 rounded-md hover:bg-[#bef264] transition-all uppercase font-mono'
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
