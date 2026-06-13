import React, { useState } from 'react';
import { useProject, type Idea } from '../context/ProjectContext';
import { 
  Lightbulb, Check, Sparkles, TrendingUp, ShieldAlert, Cpu, 
  HelpCircle, ChevronRight, Layers, FileText, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const IdeasModule: React.FC = () => {
  const { 
    rules, 
    onboarding, 
    ideas, 
    discoverIdeasAPI, 
    selectedIdea, 
    setSelectedIdea, 
    ideaVersions, 
    setIdeaVersions, 
    evolveIdeaAPI, 
    isLoading 
  } = useProject();

  // Onboarding state for whether they have an idea
  const [hasIdeaChoice, setHasIdeaChoice] = useState<'yes' | 'no' | 'partially' | null>(null);
  const [ownIdeaText, setOwnIdeaText] = useState('');
  const [ideaCount, setIdeaCount] = useState<3 | 5 | 10>(3);
  
  // Evolution modifiers
  const [customSuggestion, setCustomSuggestion] = useState('');
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [isFinalized, setIsFinalized] = useState(false);

  const modifiersList = [
    { label: "Improve Idea", value: "Improve Idea" },
    { label: "Add AI Features", value: "Add AI Features" },
    { label: "Add Accessibility", value: "Add Accessibility" },
    { label: "Add Offline Mode", value: "Add Offline Mode" },
    { label: "Add Multilingual Support", value: "Add Multilingual Support" },
    { label: "Improve Scalability", value: "Improve Scalability" },
    { label: "Reduce Scope / Focus MVP", value: "Reduce Scope" }
  ];

  const handleModifierToggle = (value: string) => {
    setSelectedModifiers(prev => 
      prev.includes(value) ? prev.filter(m => m !== value) : [...prev, value]
    );
  };

  const handleGenerateIdeas = async () => {
    await discoverIdeasAPI(ideaCount);
  };

  const handleAnalyzeOwnIdea = () => {
    if (!ownIdeaText.trim()) return;
    const initialIdea: Idea = {
      id: `own-idea-${Date.now()}`,
      title: "My Custom Idea Project",
      tagline: "Custom parsed hackathon concept",
      description: ownIdeaText,
      innovationScore: 7,
      feasibilityScore: 8,
      judgeAppealScore: 7,
      techStack: ["React", "Express", "TailwindCSS"],
      mvpScope: "Standard features list based on provided text.",
      whyItWins: "Custom built to solve user specified criteria."
    };
    setSelectedIdea(initialIdea);
    setIdeaVersions([initialIdea]);
  };

  const handleSelectIdea = (idea: Idea) => {
    setSelectedIdea(idea);
    setIdeaVersions([idea]);
  };

  const handleEvolve = async () => {
    if (!selectedIdea) return;
    const evolved = await evolveIdeaAPI(customSuggestion, selectedModifiers);
    if (evolved) {
      setCustomSuggestion('');
      setSelectedModifiers([]);
    }
  };

  const handleFinalize = () => {
    setIsFinalized(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Onboarding Choice Selection */}
      {!selectedIdea && !ideas.length && !hasIdeaChoice && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto glass-panel border border-white/5 rounded-2xl p-8 text-center space-y-6"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white font-display">Do you already have a project idea?</h2>
            <p className="text-sm text-gray-400">
              Tell us your starting point so we can discover the best pathway.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <button
              onClick={() => setHasIdeaChoice('yes')}
              className="py-4 px-6 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all font-semibold cursor-pointer"
            >
              👍 Yes, I have one
            </button>
            <button
              onClick={() => setHasIdeaChoice('no')}
              className="py-4 px-6 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all font-semibold cursor-pointer"
            >
              👎 No, I need one
            </button>
            <button
              onClick={() => setHasIdeaChoice('partially')}
              className="py-4 px-6 rounded-xl border border-white/10 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all font-semibold cursor-pointer"
            >
              🤔 Partially / Drafts
            </button>
          </div>
        </motion.div>
      )}

      {/* 2. Process Yes / Partially */}
      {!selectedIdea && (hasIdeaChoice === 'yes' || hasIdeaChoice === 'partially') && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto glass-panel border border-white/5 rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Explain your project idea
          </h2>
          <textarea
            value={ownIdeaText}
            onChange={(e) => setOwnIdeaText(e.target.value)}
            placeholder="Type your idea description, target audience, and primary features. We will analyze its feasibility, scores, and evolve it."
            className="w-full h-40 glass-input rounded-xl p-4 text-sm resize-none font-light"
          />
          <div className="flex justify-between items-center gap-3 pt-2">
            <button
              onClick={() => setHasIdeaChoice(null)}
              className="text-xs text-gray-500 hover:text-white transition-all font-mono"
            >
              ⬅ GO BACK
            </button>
            <button
              onClick={handleAnalyzeOwnIdea}
              disabled={!ownIdeaText.trim()}
              className="py-2.5 px-6 cursor-pointer rounded-lg bg-primary text-black font-extrabold text-xs hover:shadow-glow-yellow disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-black" />
              ANALYZE MY IDEA
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. Process No - Idea Discovery */}
      {!selectedIdea && hasIdeaChoice === 'no' && !ideas.length && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto glass-panel border border-white/5 rounded-2xl p-6 space-y-6"
        >
          <div className="space-y-2 text-center">
            <h2 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              How many ideas should we generate?
            </h2>
            <p className="text-xs text-gray-400">
              We will generate hackathon-winning concepts custom-tailored to your constraints.
            </p>
          </div>

          <div className="flex justify-center gap-4 py-2">
            {[3, 5, 10].map((num) => (
              <button
                key={num}
                onClick={() => setIdeaCount(num as any)}
                className={`py-3 px-6 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  ideaCount === num 
                    ? 'bg-primary text-black font-extrabold shadow-glow-yellow' 
                    : 'border border-white/10 hover:border-white/20 bg-white/2'
                }`}
              >
                {num} Ideas
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center gap-3 pt-4 border-t border-white/5">
            <button
              onClick={() => setHasIdeaChoice(null)}
              className="text-xs text-gray-500 hover:text-white transition-all font-mono"
            >
              ⬅ GO BACK
            </button>
            <button
              onClick={handleGenerateIdeas}
              disabled={isLoading}
              className="py-2.5 px-6 rounded-lg bg-primary cursor-pointer text-black font-extrabold text-xs hover:shadow-glow-yellow disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  MAPPING IDEAS...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  DISCOVER WINNING IDEAS
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* 4. Display Generated Ideas */}
      {!selectedIdea && !!ideas.length && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white font-display">Generated Hackathon Ideas</h2>
              <p className="text-xs text-gray-400">Select one idea to begin the evolution and blueprints process.</p>
            </div>
            <button
              onClick={() => {
                setHasIdeaChoice(null);
                setSelectedIdea(null);
              }}
              className="text-xs text-primary font-mono hover:underline cursor-pointer"
            >
              ⬅ RE-GENERATE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <motion.div
                whileHover={{ scale: 1.01 }}
                key={idea.id}
                className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col justify-between hover:border-primary/20 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono py-0.5 px-1.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
                      CONCEPT
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-500">JUDGE SCORE:</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {Math.round((idea.innovationScore + idea.feasibilityScore + idea.judgeAppealScore) / 3)}/10
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-white leading-tight">{idea.title}</h3>
                  <p className="text-[11px] font-mono text-gray-400 leading-snug italic">{idea.tagline}</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-light line-clamp-4">{idea.description}</p>
                  
                  <div className="flex flex-wrap gap-1 pt-2">
                    {idea.techStack.map((tech, i) => (
                      <span key={i} className="text-[9px] font-mono py-0.5 px-1.5 rounded bg-white/5 border border-white/10 text-gray-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-white/5">
                  <button
                    onClick={() => handleSelectIdea(idea)}
                    className="w-full py-2 cursor-pointer rounded-lg bg-primary text-black font-extrabold text-xs hover:shadow-glow-yellow transition-all flex items-center justify-center gap-1"
                  >
                    SELECT IDEA <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Idea Evolution Panel */}
      {selectedIdea && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Idea Card & Version Flow */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 ambient-purple opacity-20 filter blur-2xl" />
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                  <h2 className="text-base font-bold text-white">Active Idea Refinement</h2>
                </div>
                
                {/* Version Indicators */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-gray-500 mr-1.5">VERSIONS:</span>
                  {ideaVersions.map((v, idx) => {
                    const isCurrent = selectedIdea.tagline === v.tagline && selectedIdea.description === v.description;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedIdea(v)}
                        className={`w-7 h-6 rounded text-[10px] font-mono font-bold flex items-center justify-center border cursor-pointer ${
                          isCurrent 
                            ? 'bg-primary border-primary text-black shadow-glow-yellow' 
                            : 'border-white/10 text-gray-500 hover:text-white'
                        }`}
                      >
                        V{idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Idea Content */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedIdea.title}</h3>
                  <p className="text-xs font-mono text-primary mt-1">{selectedIdea.tagline}</p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-gray-500">DESCRIPTION</span>
                  <p className="text-sm text-gray-300 leading-relaxed font-light">{selectedIdea.description}</p>
                </div>

                {selectedIdea.features && (
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] font-mono text-gray-500 block">KEY REFINED FEATURES</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedIdea.features.map((feat, i) => (
                        <div key={i} className="p-3 rounded-lg bg-white/2 border border-white/5 space-y-1">
                          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-primary" />
                            {feat.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 font-light leading-snug">{feat.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-gray-500">TECH STACK</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedIdea.techStack.map((tech, i) => (
                        <span key={i} className="text-[9px] font-mono py-0.5 px-1.5 rounded bg-white/5 border border-white/10 text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-gray-500">MVP SPRINT SCOPE</span>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">{selectedIdea.mvpScope}</p>
                  </div>
                </div>

                {selectedIdea.winningStrategy && (
                  <div className="space-y-2 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">⚡ CO-FOUNDER WINNING STRATEGY</span>
                    <ul className="text-xs space-y-1.5 text-gray-400">
                      {selectedIdea.winningStrategy.map((strat, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{strat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Finalize / Unlock */}
              <div className="pt-6 mt-6 border-t border-white/5 flex flex-wrap gap-3 items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedIdea(null);
                    setIdeaVersions([]);
                    setIsFinalized(false);
                  }}
                  className="text-xs text-rose-400 font-mono hover:underline cursor-pointer"
                >
                  ⚠ CHANGE CORE CONCEPT
                </button>

                {isFinalized ? (
                  <div className="py-2 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <Check className="w-4 h-4" />
                    CONCEPT LOCKED (V{ideaVersions.length})
                  </div>
                ) : (
                  <button
                    onClick={handleFinalize}
                    className="py-3 px-8 rounded-lg bg-gradient-to-r from-emerald-400 to-emerald-500 text-black font-extrabold text-xs hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    ⚡ FINALIZE IDEA
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Evolution Control Sidebar */}
          <div className="space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono text-primary font-bold tracking-wider flex items-center gap-1.5">
                <Settings className="w-4 h-4" />
                EVOLUTION CONTROLS
              </h3>
              
              <p className="text-[11px] text-gray-400 leading-relaxed font-light">
                Continuous idea refinement. Select evolution modifiers or write custom suggestions, then prompt your AI co-founder to evolve this concept to the next version.
              </p>

              {/* Modifiers List */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gray-500">EVOLUTION TARGETS</span>
                <div className="flex flex-wrap gap-1.5">
                  {modifiersList.map((m) => {
                    const isSelected = selectedModifiers.includes(m.value);
                    return (
                      <button
                        key={m.value}
                        onClick={() => handleModifierToggle(m.value)}
                        disabled={isFinalized}
                        className={`py-1.5 px-2.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-primary border-primary text-black font-bold shadow-glow-yellow' 
                            : 'bg-white/2 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom suggestions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-gray-500">CUSTOM SUGGESTIONS</span>
                <textarea
                  value={customSuggestion}
                  onChange={(e) => setCustomSuggestion(e.target.value)}
                  disabled={isFinalized}
                  placeholder="e.g. 'Integrate Twilio SMS fallback alerts', 'Make it target senior citizens'..."
                  className="w-full h-24 glass-input rounded-lg p-3 text-xs resize-none font-light"
                />
              </div>

              {/* Evolve Button */}
              <button
                onClick={handleEvolve}
                disabled={isLoading || isFinalized || (!selectedModifiers.length && !customSuggestion.trim())}
                className="w-full py-3 rounded-lg bg-primary text-black font-extrabold text-xs hover:shadow-glow-yellow disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    EVOLVING TO V{ideaVersions.length + 1}...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black" />
                    EVOLVE IDEA (V{ideaVersions.length + 1})
                  </>
                )}
              </button>
            </div>
            
            {/* Judge Estimates */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono text-primary font-bold tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                JUDGE APPEAL ESTIMATES
              </h3>
              
              <div className="space-y-3">
                {[
                  { label: "Innovation Score", val: selectedIdea.innovationScore },
                  { label: "Technical Feasibility", val: selectedIdea.feasibilityScore },
                  { label: "Judge Appeal", val: selectedIdea.judgeAppealScore }
                ].map((score, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-400">{score.label}</span>
                      <span className="font-mono text-primary font-bold">{score.val}/10</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${score.val * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
