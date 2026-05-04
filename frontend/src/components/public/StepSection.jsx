import React from "react";
import isometric_6595c7 from "../../assets/st1.png";
import isometric_6595c8 from "../../assets/stt2.png";
import isometric_6595c9 from "../../assets/stt3.png";
import { GitBranch, Settings2, Rocket } from "lucide-react";

const StepsSection = () => {
  const stepsData = [
    {
      id: 1,
      title: "Connect Repository",
      description: "Connect your GitHub or GitLab repository. Velora automatically detects your framework and settings.",
      icon: <GitBranch size={20} className="text-[#3b82f6]" />,
      iconBg: "bg-[#3b82f6]/10",
      image: isometric_6595c7,
    },
    {
      id: 2,
      title: "Configure Build",
      description: "Set environment variables, build commands, and output directories. Override defaults as needed.",
      icon: <Settings2 size={20} className="text-[#a1a1aa]" />,
      iconBg: "bg-[#71717a]/10",
      image: isometric_6595c8,
    },
    {
      id: 3,
      title: "Deploy Globally",
      description: "Push code to deploy instantly to our global edge network. Enjoy zero downtime and instant rollbacks.",
      icon: <Rocket size={20} className="text-[#22c55e]" />,
      iconBg: "bg-[#22c55e]/10",
      image: isometric_6595c9,
    },
  ];

  return (
    <section className="bg-[#09090b] text-white font-sans py-24 px-6 md:px-12 lg:px-24 overflow-hidden select-none">
      <div className="max-w-[1200px] mx-auto">
        {/* SECTION HEADING */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
            From Code to Live
          </h2>
          <p className="text-[15px] text-[#a1a1aa] max-w-2xl mx-auto leading-relaxed">
            Deploy your application in three simple steps. We handle the complex infrastructure so you can focus on writing code.
          </p>
        </div>

        {/* STEPS CONTAINER */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {stepsData.map((step, index) => (
            <div
              key={step.id}
              className="relative flex flex-col items-start w-full group"
            >
              {/* Card visual */}
              <div className="relative mb-6 bg-[#111113] border border-white/[0.06] rounded-xl p-6 w-full flex flex-col items-center justify-center transition-all duration-300 hover:border-white/[0.12] hover:bg-[#18181b] shadow-elevation-1">
                
                <img
                  src={step.image}
                  alt={`${step.title} visual`}
                  className="w-48 h-48 md:w-56 md:h-56 object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2"
                />

                {/* Connecting Lines (Desktop Only) */}
                {index < stepsData.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-white/[0.06] z-0 pointer-events-none"></div>
                )}
              </div>

              {/* STEP TEXT CONTENT */}
              <div className="flex flex-col items-start w-full px-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${step.iconBg} flex items-center justify-center`}>
                    {step.icon}
                  </div>
                  <span className="text-xs font-semibold text-[#71717a] tracking-widest uppercase">Step {step.id}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[#a1a1aa]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
