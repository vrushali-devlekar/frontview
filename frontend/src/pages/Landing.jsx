import React from "react";
import HeroSection from "./Landing/HeroSection";
import FeaturesSection from "./Landing/FeatureSection";
import StepsSection from "./Landing/StepSection";
import Footer from "./Landing/Footer";

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