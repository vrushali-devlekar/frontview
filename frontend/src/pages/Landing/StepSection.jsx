import React from "react";

// Replace these placeholders with your actual isometric image paths
import isometric_6595c7 from "../../assets/stepp1.png";
import isometric_6595c8 from "../../assets/stepp2.png";
import isometric_6595c9 from "../../assets/stepp3.png";

const StepsSection = () => {
  const stepsData = [
    {
      id: 1,
      title: "CONNECT",
      description: "Connect your repo in a few clicks.",
      image: isometric_6595c7,
      color: "border-purple-500 text-purple-500", // Tailwind color
      lineColor: "border-velora-yellow/40", // Dotted line from 1 to 2 is yellow
    },
    {
      id: 2,
      title: "CONFIGURE",
      description: "Set environment variables and run commands.",
      image: isometric_6595c8,
      color: "border-velora-yellow text-velora-yellow",
      lineColor: "border-green-500/40", // Dotted line from 2 to 3 is green
    },
    {
      id: 3,
      title: "DEPLOY",
      description: "We build, deploy and scale automatically.",
      image: isometric_6595c9,
      color: "border-green-500 text-green-500",
      lineColor: "", // No line after the last step
    },
  ];

  return (
    <section className="bg-black text-white font-press-start py-24 px-6 md:px-20 lg:px-32 overflow-hidden">
      {/* 1. SECTION HEADING */}
      <div className="mb-20">
        <h2 className="text-xl md:text-3xl leading-relaxed uppercase">
          From code to live in
          <br />
          <span className="text-velora-yellow">3 simple steps.</span>
        </h2>
      </div>

      {/* 2. STEPS CONTAINER (Grid/Flex) */}
      <div className="relative flex flex-col md:flex-row items-center md:items-start justify-between gap-12 md:gap-4 lg:gap-12">
        {stepsData.map((step, index) => (
          <div
            key={step.id}
            className="relative flex-1 flex flex-col items-center group"
          >
            {/* === ISOMETRIC BLOCK VISUAL === */}
            <div className="relative mb-6 md:mb-8 transition-transform duration-500 group-hover:-translate-y-4">
              {/* Main Image */}
              <img
                src={step.image}
                alt={`${step.title} Isometric Block`}
                className="w-48 h-48 md:w-56 md:h-56 object-contain"
              />

              {/* Number Tag over Image */}
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 border-2 ${step.color} px-4 py-2 text-sm z-10`}
              >
                {step.id}
              </div>

              {/* Connecting Lines (Desktop Only) */}
              {/* Uses a pseudo-element border trick for the dashed 'circuit' look */}
              {index < stepsData.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-16 lg:-right-20 w-32 h-10 pointer-events-none">
                  {/* Yellow dashed path (1->2) or Green dashed path (2->3) */}
                  <div
                    className={`w-full h-full border-t-2 border-r-2 border-dashed ${step.lineColor} rounded-tr-xl opacity-60 z-0`}
                  ></div>
                </div>
              )}
            </div>

            {/* === STEP TEXT CONTENT === */}
            <div className="mt-4 flex gap-5 items-start max-w-[280px]">
              {/* Small Boxed Number */}
              <div
                className={`flex-shrink-0 border-2 ${step.color} w-8 h-8 flex items-center justify-center text-xs mt-0.5`}
              >
                {step.id}
              </div>

              {/* Text */}
              <div>
                <h3
                  className={`text-sm mb-3 uppercase tracking-tighter ${step.color.split(" ")[1]}`}
                >
                  {step.title}
                </h3>
                {/* Description uses specific text size to fit layout */}
                <p className="text-[10px] leading-loose text-gray-500 uppercase">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
