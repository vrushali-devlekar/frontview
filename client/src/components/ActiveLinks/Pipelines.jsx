import React from "react";
import { CheckCircle, PlayCircle, Lock, Terminal } from "lucide-react";

const Pipelines = () => {
  const stages = [
    { id: 1, name: "SOURCE", status: "passed", label: "Check" },
    { id: 2, name: "BUILD", status: "in-progress", label: "Build" },
    { id: 3, name: "TEST", status: "pending", label: "Question" },
    { id: 4, name: "DEPLOY", status: "pending", label: "Lock" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-8 font-mono">
      <h2 className="text-xl mb-12 tracking-widest uppercase">
        Active Pipeline: User Auth Service
      </h2>

      {/* Pipeline Container */}
      <div className="flex items-center justify-between max-w-4xl mx-auto relative mb-20">
        {/* The Connector Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0" />

        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className="relative z-10 flex flex-col items-center"
          >
            <span className="mb-4 text-xs tracking-tighter text-gray-400">
              {stage.name}
            </span>

            {/* Hexagon / Circle Node */}
            <div
              className={`
              w-24 h-24 flex items-center justify-center transition-all duration-500
              ${
                stage.status === "passed"
                  ? "bg-green-900/20 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  : stage.status === "in-progress"
                    ? "bg-orange-900/20 border-2 border-orange-500 animate-pulse"
                    : "bg-gray-900 border-2 border-gray-700"
              }
              [clip-path:polygon(25%_0%,_75%_0%,_100%_50%,_75%_100%,_25%_100%,_0%_50%)]
            `}
            >
              {stage.status === "passed" && (
                <CheckCircle className="text-green-500" size={32} />
              )}
              {stage.status === "in-progress" && (
                <PlayCircle className="text-orange-500" size={32} />
              )}
              {stage.status === "pending" && (
                <Lock className="text-gray-600" size={32} />
              )}
            </div>

            <span
              className={`mt-4 text-sm ${
                stage.status === "passed"
                  ? "text-green-400"
                  : stage.status === "in-progress"
                    ? "text-orange-400"
                    : "text-gray-500"
              }`}
            >
              {stage.status.replace("-", " ")}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal Logs Section */}
      <div className="bg-[#111] border border-gray-800 rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2 text-xs text-gray-500">
          <Terminal size={14} />
          <span>Run Logs — commit #210a • user: Henrich Vegh</span>
        </div>
        <div className="space-y-1 text-sm text-gray-300">
          <p>
            <span className="text-green-500">✔</span> Build artifact v1.2.3
            generated
          </p>
          <p>
            <span className="text-green-500">✔</span> Unit tests: 154/154 passed
          </p>
          <p className="animate-pulse text-orange-400 font-bold">
            ... Integration tests: Running
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pipelines;
