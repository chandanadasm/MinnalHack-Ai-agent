import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  Award, ShieldAlert, Sparkles, MessageSquare, Presentation, 
  ChevronRight, Volume2, HelpCircle, Download, RefreshCcw, BookOpen 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const JudgeRoomModule: React.FC = () => {
  const { selectedIdea, judgeData, generateJudgeAPI, isLoading } = useProject();
  
  const [subTab, setSubTab] = useState<'judging' | 'pitch' | 'slides'>('judging');
  
  // Pitch options
  const [pitchDuration, setPitchDuration] = useState<'s30' | 's60' | 'm2' | 'm5'>('s30');
  const [pitchMode, setPitchMode] = useState<'judge' | 'investor' | 'technical' | 'storytelling'>('judge');
  
  // Active slide detail
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  useEffect(() => {
    if (selectedIdea && !judgeData && !isLoading) {
      generateJudgeAPI();
    }
  }, [selectedIdea, judgeData]);

  if (!selectedIdea) {
    return (
      <div className="max-w-md mx-auto text-center py-12 glass-panel border border-white/5 rounded-2xl p-6">
        <HelpCircle className="w-12 h-12 text-primary/45 mx-auto mb-4 animate-pulse" />
        <h3 className="text-sm font-bold text-white mb-2">Judge Prep Locked</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please select and finalize your idea before simulating judge reviews, slides, and pitches.
        </p>
      </div>
    );
  }

  if (isLoading && !judgeData) {
    return (
      <div className="max-w-sm mx-auto text-center py-12 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-primary font-bold">SIMULATING JUDGING PANEL CRITERIA...</p>
      </div>
    );
  }

  if (!judgeData) return null;

  // Formatting helpers for pitch labels
  const getPitchLabel = (key: string) => {
    switch (key) {
      case 's30': return '30 Second Elevator';
      case 's60': return '60 Second Hook';
      case 'm2': return '2 Minute Sprint';
      case 'm5': return '5 Minute Investor';
      default: return 'Pitch';
    }
  };

  const activePitch = judgeData.pitches?.[pitchDuration] || { script: "No pitch script available.", opening: "", closing: "" };

  // Trigger individual slide regenerate mock
  const handleRegenerateSlide = (idx: number) => {
    alert(`Re-evaluating slide ${idx + 1}...`);
  };

  // PPT / Canva export mock downloads
  const handleExportPresentation = (format: 'PDF' | 'Canva' | 'PPT') => {
    const textContent = judgeData.slides.map((s: any, i: number) => `Slide ${i+1}: ${s.title}\n${s.content.join('\n')}\nNotes: ${s.speakerNotes}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `minnalhack-slides-${format.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Navigation header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display">Pitch Studio & Judge Room</h2>
          <p className="text-xs text-gray-400">Scorecard simulators, deck outlines, and survival checkpacks</p>
        </div>

        <div className="flex rounded-lg p-1 bg-white/2 border border-white/5">
          {[
            { id: 'judging', label: 'Judge Scorecard', icon: Award },
            { id: 'pitch', label: 'Pitch Studio', icon: MessageSquare },
            { id: 'slides', label: 'Presentation Slides', icon: Presentation }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`py-1.5 px-3.5 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-black font-extrabold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtab 1: Judge Scorecard & Survival */}
      {subTab === 'judging' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Circular gauges panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 ambient-yellow opacity-10 filter blur-2xl" />
              <h3 className="text-xs font-mono text-primary font-bold tracking-wider mb-6 flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5" />
                SIMULATED SCORECARD METRICS
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
                {[
                  { label: "Innovation", score: judgeData.judgeRoom?.scores?.innovation || 8 },
                  { label: "Feasibility", score: judgeData.judgeRoom?.scores?.feasibility || 7 },
                  { label: "Scalability", score: judgeData.judgeRoom?.scores?.scalability || 8 },
                  { label: "Presentation", score: judgeData.judgeRoom?.scores?.presentation || 9 },
                  { label: "Judge Appeal", score: judgeData.judgeRoom?.scores?.judgeAppeal || 8 }
                ].map((metric, i) => {
                  const percentage = metric.score * 10;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      {/* Custom SVG Circular Progress Ring */}
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-white/5"
                          strokeWidth="2.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-primary transition-all duration-700"
                          strokeWidth="2.5"
                          strokeDasharray={`${percentage}, 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text 
                          x="18" 
                          y="21" 
                          transform="rotate(90 18 18)" 
                          className="text-[9px] font-mono font-bold fill-white" 
                          textAnchor="middle"
                        >
                          {metric.score}/10
                        </text>
                      </svg>
                      <span className="text-[11px] font-medium text-gray-400">{metric.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 space-y-4 text-xs font-light leading-relaxed text-gray-300">
                <p><span className="font-bold text-white">Feedback:</span> {judgeData.judgeRoom?.feedback}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold block">STRENGTHS</span>
                    <ul className="space-y-1 text-gray-400">
                      {(judgeData.judgeRoom?.strengths || []).map((s: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-emerald-400">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-rose-400 font-bold block">WEAKNESSES</span>
                    <ul className="space-y-1 text-gray-400">
                      {(judgeData.judgeRoom?.weaknesses || []).map((w: string, idx: number) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-rose-400">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Survival Guide fallback logs */}
            <div className="glass-panel border border-white/5 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-mono text-rose-400 font-bold tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4.5 h-4.5" />
                SURVIVAL GUIDE - CRITICAL DEMO CRASH MITIGATIONS
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(judgeData.judgeRoom?.survivalGuide || []).map((guide: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-rose-500/[0.02] border border-rose-500/10 space-y-1">
                    <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {guide.scenario}
                    </h4>
                    <p className="text-[11px] text-gray-400 font-light leading-relaxed">{guide.fallbackPlan}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hero winning card */}
          <div className="space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-6 bg-gradient-to-br from-primary/10 to-[#FFD54A]/0 text-center relative overflow-hidden flex flex-col justify-center items-center py-10">
              <div className="absolute inset-0 bg-primary/2 filter blur-xl opacity-40 pointer-events-none" />
              <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center mb-4 text-primary">
                <Award className="w-6 h-6 fill-primary" />
              </div>
              <span className="text-xs font-mono text-gray-400 font-medium tracking-wider mb-2">
                ESTIMATED WIN PROBABILITY
              </span>
              <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FFE483] font-display shadow-glow-yellow mb-4">
                {judgeData.judgeRoom?.winningProbability || 85}%
              </span>
              <p className="text-[11px] text-gray-500 leading-relaxed font-light px-2">
                Based on your rules constraints, finalized scope, and team profile. Polish the slide demo to push this closer to 95%!
              </p>
            </div>
            
            <button
              onClick={generateJudgeAPI}
              disabled={isLoading}
              className="w-full py-3 rounded-lg border border-primary/20 hover:border-primary bg-primary/5 text-primary font-mono font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw className="w-4 h-4" /> RE-EVALUATE PITCH & IDEAS
            </button>
          </div>

        </div>
      )}

      {/* Subtab 2: Pitch Studio */}
      {subTab === 'pitch' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pitch Script Reader */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[500px]">
              
              <div className="space-y-4 flex-1 overflow-y-auto">
                <div className="border-b border-white/5 pb-3 mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Volume2 className="w-4.5 h-4.5 text-primary" />
                    {getPitchLabel(pitchDuration)} Pitch
                  </h3>
                  <span className="text-[10px] font-mono text-gray-500 uppercase font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {pitchMode} Mode
                  </span>
                </div>
                
                <p className="text-sm text-gray-300 leading-relaxed font-light whitespace-pre-wrap italic">
                  "{activePitch.script}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs">
                <div className="p-3 rounded-lg bg-white/2 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-emerald-400 font-bold block">STRONG OPENING HOOK</span>
                  <p className="text-gray-400 font-light leading-snug">{activePitch.opening || "Start with an open-ended question."}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/2 border border-white/5 space-y-1">
                  <span className="text-[9px] font-mono text-primary font-bold block">STRONG CLOSING CALL</span>
                  <p className="text-gray-400 font-light leading-snug">{activePitch.closing || "Leave them with a call to action."}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Pitch Controls */}
          <div className="space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-5">
              <h3 className="text-xs font-mono text-primary font-bold tracking-wider">PITCH PARAMETERS</h3>
              
              {/* Duration selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500">DURATION</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 's30', label: '30 Seconds' },
                    { id: 's60', label: '60 Seconds' },
                    { id: 'm2', label: '2 Minutes' },
                    { id: 'm5', label: '5 Minutes' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPitchDuration(opt.id as any)}
                      className={`py-2 px-3 rounded text-[11px] border transition-all cursor-pointer font-medium ${
                        pitchDuration === opt.id 
                          ? 'bg-primary border-primary text-black font-bold shadow-glow-yellow' 
                          : 'bg-white/2 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500">PITCH ANGLE / MODE</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'judge', label: 'Judge Panel' },
                    { id: 'investor', label: 'Investor Pitch' },
                    { id: 'technical', label: 'Technical Dev' },
                    { id: 'storytelling', label: 'Storytelling' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setPitchMode(opt.id as any)}
                      className={`py-2 px-3 rounded text-[11px] border transition-all cursor-pointer font-medium ${
                        pitchMode === opt.id 
                          ? 'bg-primary border-primary text-black font-bold shadow-glow-yellow' 
                          : 'bg-white/2 border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Confidence Score:</span>
                  <span className="font-mono text-primary font-bold">
                    {judgeData.judgeRoom?.scores?.presentation ? judgeData.judgeRoom?.scores?.presentation * 10 : 85}%
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gray-500 block">TIMING ANALYSIS:</span>
                  <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                    Aim for 120 words per minute. Practice speaking slowly, focusing on the solution slide transition.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Subtab 3: Slide Deck */}
      {subTab === 'slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Active slide layout */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between h-[450px]">
              
              <div className="space-y-6 flex-1">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-[10px] font-mono text-primary font-bold tracking-wider">
                    SLIDE {activeSlideIdx + 1} OF {judgeData.slides?.length || 8}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    {judgeData.slides?.[activeSlideIdx]?.type || 'Content'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-extrabold text-white font-display">
                  {judgeData.slides?.[activeSlideIdx]?.title || 'Slide Title'}
                </h3>

                {/* Content bullets */}
                <ul className="space-y-3 pt-2 text-sm text-gray-300 font-light leading-relaxed">
                  {(judgeData.slides?.[activeSlideIdx]?.content || []).map((bullet: string, i: number) => (
                    <li key={i} className="flex gap-3 items-start">
                      <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation arrows */}
              <div className="flex justify-between items-center pt-6 border-t border-white/5">
                <button
                  onClick={() => setActiveSlideIdx(prev => Math.max(0, prev - 1))}
                  disabled={activeSlideIdx === 0}
                  className="py-1.5 px-3 rounded border border-white/10 hover:border-white/20 text-xs text-gray-400 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                >
                  ◀ PREVIOUS
                </button>
                <button
                  onClick={() => handleRegenerateSlide(activeSlideIdx)}
                  className="py-1.5 px-3 rounded border border-primary/20 hover:border-primary text-xs text-primary font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCcw className="w-3.5 h-3.5" /> RE-BUILD SLIDE
                </button>
                <button
                  onClick={() => setActiveSlideIdx(prev => Math.min((judgeData.slides?.length || 8) - 1, prev + 1))}
                  disabled={activeSlideIdx === (judgeData.slides?.length || 8) - 1}
                  className="py-1.5 px-3 rounded border border-white/10 hover:border-white/20 text-xs text-gray-400 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                >
                  NEXT ▶
                </button>
              </div>

            </div>

            {/* Speaker notes */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono text-gray-500">SPEAKER NOTES / PRESENTATION COACH TIPS:</span>
              <p className="text-xs text-gray-300 leading-relaxed font-mono font-light italic">
                "{judgeData.slides?.[activeSlideIdx]?.speakerNotes || 'Speak with energy, setting details based on standard instructions.'}"
              </p>
            </div>
          </div>

          {/* Slides List & Export */}
          <div className="space-y-6">
            
            {/* Outline list */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] font-mono text-gray-500">DECK OUTLINE</span>
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                {(judgeData.slides || []).map((slide: any, idx: number) => {
                  const isCurrent = activeSlideIdx === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveSlideIdx(idx)}
                      className={`w-full py-2 px-3 rounded text-left text-xs transition-all flex justify-between items-center cursor-pointer ${
                        isCurrent 
                          ? 'bg-primary/15 border border-primary/30 text-primary font-semibold' 
                          : 'bg-white/2 border border-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{idx + 1}. {slide.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exports */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] font-mono text-gray-500">EXPORT FORMATS</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: "Export to PPT", format: "PPT" },
                  { label: "Download Slide PDF", format: "PDF" },
                  { label: "Push to Canva", format: "Canva" }
                ].map((exp, i) => (
                  <button
                    key={i}
                    onClick={() => handleExportPresentation(exp.format as any)}
                    className="w-full py-2.5 rounded-lg bg-white/2 border border-white/5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    {exp.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
