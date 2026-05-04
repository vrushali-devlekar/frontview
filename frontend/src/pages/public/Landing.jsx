import React from "react";
import HeroSection from "../../components/public/HeroSection";
import FeaturesSection from "../../components/public/Features";
import StepsSection from "../../components/public/StepSection";
import Footer from "../../components/public/Footer";

const Landing = () => {
  return (
    <div>
      <HeroSection />
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="how-it-works">
        <StepsSection />
      </div>
      <div id="ready-to-deploy">
        <Footer/>
      </div>
    </div>
  );
};


export default Landing;
