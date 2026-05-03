import React from 'react'
import Navbar from '../Main/Navbar'
import HeroSection from '../Main/HeroSection'
import WhyChoose from '../Main/WhyChoose'
import HowItWorks from '../Main/HowItWorks'
import ReadyToDeploy from '../Main/ReadyToDeploy'
import Footer from '../Main/Footer'

const Landing = () => {
  return (
    <div className='min-h-screen bg-[#0a0a0a]'>
      <Navbar />
      <main>
        <HeroSection />
        <WhyChoose />
        <HowItWorks />
        <ReadyToDeploy />
      </main>
      <Footer />
    </div>
  )
}

export default Landing;
