import React from "react";
import isometric_6595c7 from "../../assets/stepp1.png";
import isometric_6595c8 from "../../assets/stepp2.png";
import isometric_6595c9 from "../../assets/stepp3.png";

const StepsSection = () => {
  const stepsData = [
    {
      id: 1,
      title: "CONNECT",
      description: "CONNECT YOUR REPO IN A FEW CLICKS. VELORA AUTOMATICALLY DETECTS FRAMEWORKS.",
      image: isometric_6595c7,
      color: "valora-cyan", 
      lineColor: "border-valora-cyan/40", 
    },
    {
      id: 2,
      title: "CONFIGURE",
      description: "SET ENVIRONMENT VARIABLES AND OVERRIDE BUILD COMMANDS IF NEEDED.",
      image: isometric_6595c8,
      color: "valora-yellow",
      lineColor: "border-valora-yellow/40", 
    },
    {
      id: 3,
      title: "DEPLOY",
      description: "WE BUILD, DEPLOY AND SCALE AUTOMATICALLY. ENJOY ZERO DOWNTIME.",
      image: isometric_6595c9,
      color: "white",
      lineColor: "", 
    },
  ];

  return (
    <section className="bg-valora-bg text-white font-mono py-24 px-6 md:px-20 lg:px-32 overflow-hidden select-none">
      {/* SECTION HEADING */}
      <div className="mb-20 flex items-center gap-4">
        <div className="h-6 w-1 bg-valora-yellow"></div>
        <h2 className="text-xl md:text-2xl font-pixel uppercase tracking-widest text-white">
          FROM CODE TO LIVE IN <span className="text-valora-yellow">3 STEPS</span>
        </h2>
      </div>

      {/* STEPS CONTAINER */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-4 lg:gap-12">
        {stepsData.map((step, index) => (
          <div
            key={step.id}
            className="relative flex-1 flex flex-col items-center group w-full"
          >
            {/* ISOMETRIC BLOCK VISUAL */}
            <div className="relative mb-6 md:mb-8 bg-valora-card border-2 border-valora-border p-4 w-full flex items-center justify-center hover:border-gray-500 transition-colors">
               <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-${step.color}`}></div>
               <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#333]`}></div>

              <img
                src={step.image}
                alt={`${step.title} Isometric Block`}
                className="w-40 h-40 md:w-56 md:h-56 object-contain"
              />

              {/* Number Tag over Image */}
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#050505] border-2 border-${step.color} px-4 py-2 text-sm font-pixel text-${step.color} z-10`}
              >
                0{step.id}
              </div>

              {/* Connecting Lines (Desktop Only) */}
              {index < stepsData.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-16 lg:-right-20 w-32 h-10 pointer-events-none">
                  <div
                    className={`w-full h-full border-t-2 border-r-2 border-dashed ${step.lineColor} rounded-tr-xl opacity-60 z-0`}
                  ></div>
                </div>
              )}
            </div>

            {/* STEP TEXT CONTENT */}
            <div className="mt-4 flex flex-col items-start w-full bg-[#0a0a0a] p-6 border-l-2 border-[#333] hover:border-white transition-colors">
                <span className={`text-[10px] text-${step.color} font-bold tracking-widest uppercase mb-2`}>STEP 0{step.id}</span>
                <h3 className="text-sm mb-4 font-pixel text-white uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[10px] leading-loose text-gray-500 uppercase tracking-widest">
                  {step.description}
                </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
