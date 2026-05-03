import React from 'react'
// IMPORTANT: Refer to your local assets folder to ensure these render.
import grassBlockImg from '../../assets/grassbk.png'
import creeperImg from '../../assets/sk.png' // Or creeper.png

export default function ReadyToDeploy() {
  return (
    <section className="bg-transparent py-24 px-4 overflow-hidden relative">
      <div className="max-w-6xl mx-auto relative group">
        
        {/* Left Side Asset: Grass Block overlapping the frame */}
        <div className="absolute -left-10 bottom-[-20px] w-48 z-30 pointer-events-none transition-transform group-hover:scale-105 duration-500 hidden md:block">
          <img 
            src={grassBlockImg} 
            alt="Minecraft Grass Block" 
            className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" 
          />
        </div>

        {/* Main Banner Box with exact reference-accurate rounded corners */}
        <div className="relative z-10 border border-[#a3e635]/30 bg-[#0d0d0d] rounded-[12px] p-12 py-16 flex flex-col md:flex-row items-center justify-center gap-12 overflow-hidden shadow-2xl">
          
          {/* Subtle Inner Glow for depth */}
          <div className="absolute inset-0 z-0 bg-radial-gradient from-[#a3e635]/5 via-transparent to-transparent opacity-60 pointer-events-none" />

          {/* Text Content - Positioned to the right of the Grass block on desktop */}
          <div className='md:ml-40 flex-1 text-center md:text-left relative z-20'>
            <h2 
              className="text-white text-3xl md:text-4xl font-bold mb-3 tracking-tight leading-tight"
              style={{ fontFamily: "'Space Mono', monospace" }} // Using Space Mono for a consistent dev feel
            >
              Ready to deploy?
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-mono opacity-90 leading-relaxed">
              Join thousands of developers shipping faster with Velora.
            </p>
          </div>

          {/* Buttons Section with modern rounded geometry */}
          <div className='relative z-20 flex flex-wrap gap-4 items-center justify-center'>
            <button className="bg-[#a3e635] text-black font-bold text-xs px-10 py-4 rounded-xl hover:bg-[#bef264] transition-all font-mono uppercase shadow-[0_0_15px_rgba(163,230,53,0.3)]">
              Get Started Free →
            </button>
            
            <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-xs px-10 py-4 rounded-xl transition-all font-mono uppercase flex items-center gap-2">
              View Docs
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </button>
          </div>

          {/* Right Side Asset: Creeper peeking around the right edge */}
          <div className="absolute right-[-20px] bottom-[-30px] w-48 z-30 pointer-events-none transition-transform group-hover:-translate-y-4 duration-500 hidden md:block">
            <img 
              src={creeperImg} 
              alt="Creeper Character" 
              className="w-full h-auto drop-shadow-[0_10px_50px_rgba(0,0,0,0.8)]" 
            />
          </div>
        </div>
      </div>
    </section>
  )
}