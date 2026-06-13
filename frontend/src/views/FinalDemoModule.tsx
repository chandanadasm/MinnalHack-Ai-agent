import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Award, Zap, Download, Layers, Calendar, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinalDemoModule: React.FC = () => {
  const { 
    selectedIdea, 
    rules, 
    blueprint, 
    buildPlan, 
    judgeData, 
    exportPackageAPI, 
    onboarding 
  } = useProject();

  if (!selectedIdea || !blueprint || !buildPlan || !judgeData) {
    return (
      <div className="max-w-md mx-auto text-center py-12 glass-panel border border-white/5 rounded-2xl p-6">
        <HelpCircle className="w-12 h-12 text-primary/45 mx-auto mb-4 animate-pulse" />
        <h3 className="text-sm font-bold text-white mb-2">Final Demo Locked</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please complete your idea discovery, blueprints, roadmaps, and pitch coaching before loading the final Showcase.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display">🏆 Final Judge Showcase Mode</h2>
          <p className="text-xs text-gray-400">One-click presentation center for hackathon judges & investors</p>
        </div>
        
        {/* Export blueprint center button */}
        <button
          onClick={exportPackageAPI}
          className="py-3 px-6 cursor-pointer rounded-lg bg-gradient-to-r from-primary to-primary-dark text-black font-extrabold text-xs hover:shadow-glow-yellow hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          EXPORT BLUEPRINT PACKAGE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Product Specifications & Architecture */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Product Overview */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 ambient-purple opacity-20 filter blur-3xl" />
            <span className="text-[9px] font-mono text-primary font-bold border border-primary/20 bg-primary/5 px-2 py-0.5 rounded tracking-wide uppercase">
              Final Concept
            </span>
            <h3 className="text-2xl font-extrabold text-white font-display mt-2.5">{selectedIdea.title}</h3>
            <p className="text-xs font-mono text-gray-400 mt-1 italic">"{selectedIdea.tagline}"</p>
            <p className="text-xs text-gray-300 leading-relaxed font-light mt-3">{selectedIdea.description}</p>
            
            <div className="flex flex-wrap gap-1.5 pt-4">
              {selectedIdea.techStack.map((tech, i) => (
                <span key={i} className="text-[9px] font-mono py-0.5 px-2 rounded bg-white/5 border border-white/10 text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Solution & Architecture details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" />
                SYSTEM ARCHITECTURE
              </span>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                {blueprint.architecture}
              </p>
            </div>

            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                COMPETITIVE DIFFERENTIATION
              </span>
              <p className="text-xs text-gray-300 leading-relaxed font-light">
                {blueprint.competitiveAdvantage}
              </p>
            </div>

          </div>

          {/* Roadmap Phase brief */}
          <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              MILESTONE ROADMAP OUTLINE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {(buildPlan.roadmap || []).slice(0, 4).map((phase: any, i: number) => (
                <div key={i} className="p-3 rounded-lg bg-white/2 border border-white/5 space-y-1">
                  <span className="text-[8px] font-mono text-primary font-bold">{phase.phase}</span>
                  <h4 className="text-xs font-bold text-white truncate">{phase.title}</h4>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Score card, winning prob, slides outline, pitch */}
        <div className="space-y-6">
          
          {/* Prob Card */}
          <div className="glass-panel border border-white/5 rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-[#FFD54A]/0 text-center relative overflow-hidden flex flex-col justify-center items-center py-8">
            <div className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center mb-3 text-primary">
              <Award className="w-5 h-5 fill-primary" />
            </div>
            <span className="text-[10px] font-mono text-gray-400 tracking-wider mb-1">
              PROJ WINNING PROBABILITY
            </span>
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FFE483] font-display shadow-glow-yellow">
              {judgeData.judgeRoom?.winningProbability || 88}%
            </span>
            <div className="grid grid-cols-5 gap-2 w-full mt-5 text-center text-[10px] font-mono">
              {[
                { l: "INO", v: judgeData.judgeRoom?.scores?.innovation },
                { l: "FES", v: judgeData.judgeRoom?.scores?.feasibility },
                { l: "SCA", v: judgeData.judgeRoom?.scores?.scalability },
                { l: "PRE", v: judgeData.judgeRoom?.scores?.presentation },
                { l: "APL", v: judgeData.judgeRoom?.scores?.judgeAppeal }
              ].map((s, idx) => (
                <div key={idx} className="bg-white/2 border border-white/5 p-1 rounded">
                  <p className="text-gray-500 font-bold">{s.l}</p>
                  <p className="text-primary font-extrabold">{s.v}/10</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pitch Snippet */}
          <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-primary" />
              60-SECOND PITCH SCRIPTER
            </span>
            <p className="text-xs text-gray-300 leading-relaxed italic font-light">
              "{judgeData.pitches?.s60?.script || 'Elevator pitch script preview'}"
            </p>
          </div>

          {/* Slides layout preview list */}
          <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-mono text-gray-500 block">SLIDE DECK SEQUENCE</span>
            <div className="space-y-1.5">
              {(judgeData.slides || []).slice(0, 5).map((slide: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-[11px] p-2 bg-white/2 border border-white/5 rounded text-gray-400">
                  <span>{idx + 1}. {slide.title}</span>
                  <span className="text-[8px] font-mono text-gray-500">{slide.type.toUpperCase()}</span>
                </div>
              ))}
              {judgeData.slides && judgeData.slides.length > 5 && (
                <p className="text-[10px] font-mono text-gray-500 text-center pt-1">
                  + {judgeData.slides.length - 5} more slides in deck
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
