import React from "react";
import HeroSection from "../../components/public/HeroSection";
import FeaturesSection from "../../components/public/Features";
import StepsSection from "../../components/public/StepSection";
import Footer from "../../components/public/Footer";

const Landing = () => {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <StepsSection />
      <Footer/>
    </div>
  );
};

export default Landing;