import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { Bot, User, Send, Check, Sparkles, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const CoFounderChat: React.FC = () => {
  const { 
    chatHistory, 
    sendChatMessageAPI, 
    onboarding, 
    setOnboarding,
    rules,
    isLoading 
  } = useProject();

  const [inputMessage, setInputMessage] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested starter prompts if chat is empty
  const starterPrompts = [
    "Let's finalize our project goals.",
    "Help me match our team skills to a winning idea.",
    "Suggest a strategy for a 48-hour hackathon."
  ];

  const activePrompts = chatHistory.length === 0 ? starterPrompts : [
    "Let's start brainstorming ideas.",
    "Tell me more about the judges' priorities.",
    "How should we divide tasks in our team?"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setInputMessage('');
    await sendChatMessageAPI(text);
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillInput.trim()) return;
    if (!onboarding.teamSkills.includes(skillInput.trim())) {
      setOnboarding((prev: any) => ({
        ...prev,
        teamSkills: [...prev.teamSkills, skillInput.trim()]
      }));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setOnboarding((prev: any) => ({
      ...prev,
      teamSkills: prev.teamSkills.filter((s: string) => s !== skill)
    }));
  };

  const toggleGoal = (goal: string) => {
    const goals = onboarding.goals.includes(goal)
      ? onboarding.goals.filter((g: string) => g !== goal)
      : [...onboarding.goals, goal];
    setOnboarding((prev: any) => ({ ...prev, goals }));
  };

  const availableGoals = ["Win", "Learn", "MVP", "Prototype", "Startup Validation"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-230px)] min-h-[500px]">
      
      {/* 1. Chat Dialog System (2 columns wide on desktop) */}
      <div className="lg:col-span-2 flex flex-col justify-between glass-panel rounded-2xl border border-white/5 overflow-hidden">
        
        {/* Header */}
        <div className="py-4 px-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">MINNAL Co-Founder Chat</h2>
              <p className="text-[10px] font-mono text-gray-500">Always active • Speaks your language</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[10px] font-mono text-primary font-bold">READY TO COACH</span>
          </div>
        </div>

        {/* Conversation logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatHistory.length === 0 && (
            <div className="text-center py-10 flex flex-col items-center max-w-sm mx-auto">
              <Sparkles className="w-8 h-8 text-primary/45 mb-4 animate-pulse" />
              <p className="text-sm text-gray-300 font-semibold mb-2">Welcome to MINNALHACK</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                I am your venture-backed co-founder. Tell me about your team size, skills, and goals, or paste your rules to formulate a game plan.
              </p>
            </div>
          )}

          {chatHistory.map((msg, idx) => {
            const isBot = msg.role === 'model';
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={`flex gap-3 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isBot 
                    ? 'bg-primary/10 border-primary/20 text-primary' 
                    : 'bg-white/5 border-white/10 text-gray-300'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  isBot 
                    ? 'bg-white/[0.03] border border-white/5 text-gray-200' 
                    : 'bg-primary text-black font-medium'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips & Prompt Input */}
        <div className="p-4 border-t border-white/5 bg-white/1 space-y-4">
          {/* Active Chips */}
          <div className="flex flex-wrap gap-2">
            {activePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="py-1.5 px-3 rounded-full text-xs border border-white/10 hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Typing Area */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputMessage);
            }} 
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Message your co-founder (e.g. 'We want to make a Node backend and React view...')"
              className="flex-1 rounded-lg glass-input py-3 px-4 text-sm font-sans font-light"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 cursor-pointer rounded-lg bg-primary text-black hover:shadow-glow-yellow disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Onboarding Memory Dashboard (1 column wide on desktop) */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        
        {/* Core Rules Summary (If exists) */}
        {rules && (
          <div className="glass-panel border border-white/5 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 ambient-yellow opacity-10 filter blur-xl" />
            <h3 className="text-xs font-mono text-primary font-bold tracking-wider mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              DETECTED HACK RULES
            </h3>
            <p className="text-xs text-gray-400 font-semibold mb-2">{rules.theme}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3 mb-3">{rules.summary}</p>
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-gray-500">CONSTRAINTS DETECTED:</div>
              <ul className="text-[10px] space-y-1 text-gray-400">
                {(rules.constraints || []).slice(0, 3).map((c: string, i: number) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-primary">•</span>
                    <span className="line-clamp-1">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Memory Dashboard Editor */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 flex-1 space-y-5">
          <h3 className="text-xs font-mono text-primary font-bold tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            PROJECT MEMORY ENGINE
          </h3>

          {/* Hack Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-500">HACKATHON NAME</label>
            <input
              type="text"
              value={onboarding.hackathonName}
              onChange={(e) => setOnboarding((prev: any) => ({ ...prev, hackathonName: e.target.value }))}
              placeholder="e.g. Minnal Hackathon"
              className="w-full rounded-lg glass-input py-2 px-3 text-xs"
            />
          </div>

          {/* Theme */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-gray-500">THEME/FOCUS</label>
            <input
              type="text"
              value={onboarding.theme}
              onChange={(e) => setOnboarding((prev: any) => ({ ...prev, theme: e.target.value }))}
              placeholder="e.g. AI SaaS, FinTech"
              className="w-full rounded-lg glass-input py-2 px-3 text-xs"
            />
          </div>

          {/* Timeline & Size */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-gray-500">DURATION</label>
              <input
                type="text"
                value={onboarding.duration}
                onChange={(e) => setOnboarding((prev: any) => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g. 48 Hours"
                className="w-full rounded-lg glass-input py-2 px-3 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-gray-500">TEAM SIZE</label>
              <select
                value={onboarding.teamSize}
                onChange={(e) => setOnboarding((prev: any) => ({ ...prev, teamSize: e.target.value }))}
                className="w-full rounded-lg glass-input py-2 px-3 text-xs bg-black"
              >
                {["1", "2", "3", "4", "5", "6+"].map(size => (
                  <option key={size} value={size}>{size} Member{size !== '1' ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills Tag Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-gray-500">TEAM SKILLS</label>
            <form onSubmit={addSkill} className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type skill and press enter"
                className="flex-1 rounded-lg glass-input py-1.5 px-3 text-xs"
              />
            </form>
            <div className="flex flex-wrap gap-1.5">
              {onboarding.teamSkills.length === 0 && (
                <span className="text-[10px] text-gray-600 font-light italic">No skills registered yet</span>
              )}
              {onboarding.teamSkills.map((skill: string, i: number) => (
                <span 
                  key={i} 
                  className="py-1 px-2 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300 flex items-center gap-1.5 hover:border-rose-500/30 hover:bg-rose-500/5 hover:text-rose-400 transition-all cursor-pointer"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <span className="text-[8px] font-bold">×</span>
                </span>
              ))}
            </div>
          </div>

          {/* Goals Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-gray-500">PRIMARY HACKATHON GOAL</label>
            <div className="flex flex-wrap gap-1.5">
              {availableGoals.map((goal) => {
                const isSelected = onboarding.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`py-1 px-2.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.1)]' 
                        : 'bg-white/2 border border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'
                    }`}
                  >
                    {isSelected && "✓ "}
                    {goal}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
