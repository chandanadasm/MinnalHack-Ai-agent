import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface CinematicEntryProps {
  onComplete: () => void;
}

export const CinematicEntry: React.FC<CinematicEntryProps> = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const steps = [
    "⚡ Initializing MINNAL Engine...",
    "⚡ Loading AI Co-Founder...",
    "⚡ Preparing Hackathon Intelligence...",
    "⚡ Connecting Mentor Systems...",
    "⚡ Ready"
  ];

  useEffect(() => {
    if (stepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, steps.length]);

  return (
    <div className="fixed inset-0 bg-[#090909] flex flex-col items-center justify-center z-50 overflow-hidden font-display">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 ambient-purple opacity-40 filter blur-3xl pointer-events-none" />
      <div className="absolute inset-0 ambient-blue opacity-40 filter blur-3xl pointer-events-none" />
      
      {/* Subtle lightning strike flash overlays */}
      <div className="absolute inset-0 bg-white/5 opacity-0 animate-lightning pointer-events-none" />

      {/* Main Container */}
      <div className="text-center px-4 max-w-md w-full relative z-10 flex flex-col items-center">
        {/* Glowing Lightning Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
            filter: [
              'drop-shadow(0 0 10px rgba(255, 213, 74, 0.4))',
              'drop-shadow(0 0 25px rgba(255, 213, 74, 0.8))',
              'drop-shadow(0 0 10px rgba(255, 213, 74, 0.4))'
            ]
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center mb-10 text-primary"
        >
          <Zap className="w-10 h-10 fill-primary" />
        </motion.div>

        {/* Brand Header */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FFE483] mb-8"
        >
          MINNALHACK
        </motion.h1>

        {/* Typing Steps Log */}
        <div className="h-44 text-left w-full glass-panel rounded-xl p-6 border border-white/5 space-y-3 font-mono text-sm leading-relaxed text-gray-400">
          {steps.slice(0, stepIndex + 1).map((step, idx) => {
            const isReady = step === "⚡ Ready";
            const isCurrent = idx === stepIndex;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`${isReady ? 'text-primary font-bold shadow-glow-yellow' : ''} flex items-center`}
              >
                <span className="mr-2">
                  {isCurrent && !isReady ? (
                    <motion.span 
                      animate={{ opacity: [1, 0, 1] }} 
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className="inline-block w-2 h-4 bg-primary"
                    />
                  ) : (
                    "✔"
                  )}
                </span>
                {step}
              </motion.div>
            );
          })}
        </div>

        {/* Enter workspace button */}
        <div className="h-16 mt-8">
          <AnimatePresence>
            {stepIndex === steps.length - 1 && (
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                onClick={onComplete}
                className="w-full py-4 px-8 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-black font-extrabold tracking-wide hover:shadow-glow-yellow hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
              >
                ENTER WORKSPACE
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
