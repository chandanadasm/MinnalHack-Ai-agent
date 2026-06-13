import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Check, Dot } from 'lucide-react';

export const ProgressTracker: React.FC = () => {
  const { selectedIdea, blueprint, buildPlan, judgeData } = useProject();

  const steps = [
    { label: 'Idea', isComplete: !!selectedIdea },
    { label: 'Blueprint', isComplete: !!blueprint },
    { label: 'Build Plan', isComplete: !!buildPlan },
    { label: 'Pitch', isComplete: !!judgeData?.pitches },
    { label: 'Judge Prep', isComplete: !!judgeData?.judgeRoom },
    { label: 'Final Demo', isComplete: !!selectedIdea && !!blueprint && !!buildPlan && !!judgeData }
  ];

  return (
    <div className="w-full glass-card rounded-xl p-4 border border-white/5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Track Title */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-gray-400 tracking-wider">PROJECT PROGRESS FLOW</span>
        </div>

        {/* Steps List */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-1 sm:gap-x-4">
          {steps.map((step, idx) => {
            const showArrow = idx < steps.length - 1;
            return (
              <React.Fragment key={idx}>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    step.isComplete 
                      ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                      : 'border border-white/10 text-gray-500 bg-white/2'
                  }`}>
                    {step.isComplete ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className={`text-xs font-medium tracking-wide ${
                    step.isComplete ? 'text-white font-semibold' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {showArrow && (
                  <span className="text-gray-700 hidden sm:inline">➡</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
