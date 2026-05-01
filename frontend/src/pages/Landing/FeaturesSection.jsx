import React from 'react';
import { ArrowUpRight } from 'lucide-react'; // Using Lucide for a clean, sharp icon

// Replace these paths with your actual asset locations
import grassImg from '../../assets/grassImg.png';
import graphImg from '../../assets/graphImg.png';
import shieldImg from '../../assets/shieldImg.png';
import boltImg from '../../assets/boltImg.png';

const FeaturesSection = () => {
  const cards = [
    {
      title: "ANY STACK",
      desc: "Deploy Node, Python, Go, Rust, Java or any stack you love.",
      img: grassImg
    },
    {
      title: "AUTO-SCALING",
      desc: "Handle traffic spikes with auto-scaling infrastructure.",
      img: graphImg
    },
    {
      title: "PRIVATE BY DEFAULT",
      desc: "Isolated environments, VPC networking, and enterprise grade security.",
      img: shieldImg
    },
    {
      title: "ZERO CONFIG",
      desc: "Push code. We handle the rest. No YAML headaches.",
      img: boltImg
    }
  ];

  return (
    <section className="bg-black text-white font-press-start py-14 px-6 md:px-14">
      {/* Heading Area */}
      <div className="mb-16">
        <h2 className="text-xl md:text-2xl leading-relaxed max-w-xl uppercase">
          Everything you need to <span className="text-[#facc15]">ship</span> and scale.
        </h2>
        <div className="h-1 w-16 bg-green-500 mt-4"></div>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {cards.map((card, index) => (
          <div key={index} className="bg-[#111111] border border-gray-800 rounded-xl px-4 py-4 flex flex-col items-start relative group hover:border-[#facc15] transition-colors">
            <img src={card.img} alt={card.title} className="w-18 h-16 mb-8 object-contain" />
            <h3 className="text-[11px] mb-4 text-white uppercase tracking-tight">{card.title}</h3>
            <p className="text-[10px] leading-loose text-gray-500 uppercase mb-8">{card.desc}</p>
            
            {/* Replaced Image with Icon */}
            <button className="absolute bottom-6 right-6 border border-gray-700 p-2 rounded hover:border-[#facc15] hover:bg-[#facc15]/10 group-hover:text-[#facc15] transition-all">
               <ArrowUpRight size={18} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>

      {/* Large Bottom Card */}
      <div className="bg-[#111111] border border-gray-800 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
        {/* Mockup Terminal Side */}
        <div className="w-full md:w-1/2 bg-black/50 border border-gray-800 rounded-lg p-6 font-mono">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                <span className="text-gray-600 text-xs">⚡</span>
                <span className="text-gray-400 text-[10px]">PR-115-FIX-AUTH</span>
             </div>
             <div className="h-1 w-4 bg-green-500"></div>
          </div>
          <div className="space-y-3 text-[10px]">
            <div className="flex items-center gap-3 text-gray-500">
               <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span> Building
            </div>
            <div className="flex items-center gap-3 text-gray-500">
               <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span> Tests Passed
            </div>
            <div className="flex items-center gap-3 text-green-500">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Deploying
            </div>
          </div>
        </div>

        {/* Text Side */}
        <div className="w-full md:w-1/2">
          <p className="text-[sm md:text-[12px] mb-6 uppercase leading-relaxed">Deployments that just work.</p>
          <p className="text-[10px] md:text-[10px] text-gray-500 leading-loose uppercase">
            From commit to production in seconds. Instant rollbacks. Preview deployments.
            Everything optimized for <span className="text-green-500">developers.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;