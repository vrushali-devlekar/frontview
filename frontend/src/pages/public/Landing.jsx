
// import React from 'react'
// // import HeroSection from "../../components/public/HeroSection";
// // import FeaturesSection from "../../components/public/Features";
// // import StepsSection from "../../components/public/StepSection";
// // import Footer from "../../components/public/Footer";
// import Navbar from '../Main/Navbar'
// import HeroSection from '../Main/HeroSection'
// import WhyChoose from '../Main/WhyChoose'
// import HowItWorks from '../Main/HowItWorks'
// // import BuiltForDevelopers from '../Main/BuiltForDevelopers'
// // import DeployAnything from '../Main/DeployAnything'
// import ReadyToDeploy from '../Main/ReadyToDeploy'
// import Footer from '../Main/Footer'
// const Landing = () => {
//   return (
//     <div className='min-h-screen bg-[#0a0a0a]'>
//       <Navbar />
//       <main>
//         <HeroSection />
//         <WhyChoose />
//         <HowItWorks />
//         {/* <BuiltForDevelopers /> */}
//         {/* <DeployAnything /> */}

//         <ReadyToDeploy />
//       </main>
//       <Footer />

//       {/* <HeroSection />
//       <FeaturesSection />
//       <StepsSection />
//       <Footer/> */}
//     </div>
//   )
// }

// export default Landing

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

