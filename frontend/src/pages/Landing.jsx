import React from "react";
import { motion } from "framer-motion";
import HeroSection from "./Landing/HeroSection";
import Footer from "./Landing/Footer";
import HowItWorks from "./Landing/HowItWorks";
import TeamSection from "./Landing/TeamSection";

const Landing = () => {
  return (
    // The wrapper ensures everything stays in a column and 
    // animations trigger correctly on scroll.
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col bg-black overflow-x-hidden"
    >
      {/* Each section is now a clean, blocky Minecraft-style segment */}
      
      <section id="hero">
        <HeroSection />
      </section>

      <section id="team">
        <TeamSection />
      </section>

      <section id="how-it-works">
        <HowItWorks />
      </section>

      <Footer />
    </motion.div>
  );
};

export default Landing;