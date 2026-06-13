import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { motion } from 'framer-motion';
import { Zap, Upload, Globe, FileText, Send, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { analyzeRulesAPI, setHasStarted, isLoading } = useProject();
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleBuild = async () => {
    if (!textInput && !urlInput && !uploadedFile) {
      alert("Please paste rules, enter a website URL, or upload a rules document/screenshot to start!");
      return;
    }
    
    // Analyze rules
    await analyzeRulesAPI(uploadedFile, textInput, urlInput);
    
    // Set started, which transitions to the core chat and navigation workspace
    setHasStarted(true);
  };

  const handleStartChat = () => {
    setHasStarted(true);
  };

  return (
    <div className="min-h-screen bg-[#090909] text-gray-200 relative overflow-hidden flex flex-col justify-between electric-grid">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] ambient-purple opacity-30 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] ambient-blue opacity-30 filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] ambient-yellow opacity-10 filter blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary fill-primary" />
          <span className="font-display font-extrabold tracking-wider text-xl text-white">MINNALHACK</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
          <span>v1.0.0-beta</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400">DEMO READY</span>
        </div>
      </header>

      {/* Main Hero & Input Panel Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 relative z-10 py-12">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">
          
          {/* Logo Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 py-1.5 px-3 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            THE ULTIMATE HACKATHON CO-FOUNDER
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight"
          >
            ⚡ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FFE483]">MINNALHACK</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg max-w-xl mb-12 font-sans font-light leading-relaxed"
          >
            Transform hackathon rules, constraints, ideas, and judging criteria into a winning project plan.
          </motion.p>

          {/* Primary Glassmorphic Input Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full glass-panel rounded-2xl p-6 border border-white/5 shadow-2xl relative"
          >
            {/* Background energy aura */}
            <div className="absolute inset-0 bg-primary/2 rounded-2xl filter blur-xl opacity-50 pointer-events-none" />

            {/* Input Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
              {/* Text / Rules paste */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Paste Rules or Concept
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste rules, deadlines, judging rubrics, or just a raw app concept here..."
                  className="w-full h-36 rounded-lg glass-input p-3 text-sm resize-none font-sans font-light"
                />
              </div>

              {/* File drag-and-drop & URL */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    Upload rules document / screenshot
                  </span>
                  
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border border-dashed rounded-lg flex-1 flex flex-col items-center justify-center p-4 transition-all duration-200 relative ${
                      dragActive 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : uploadedFile 
                          ? 'border-emerald-500/50 bg-emerald-500/5' 
                          : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept=".pdf,image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    
                    <Upload className={`w-8 h-8 mb-2 ${uploadedFile ? 'text-emerald-400' : 'text-gray-500'}`} />
                    <span className="text-xs text-center font-light">
                      {uploadedFile 
                        ? `Selected: ${uploadedFile.name}` 
                        : "Drag & drop PDF / image or click to browse"
                      }
                    </span>
                    <span className="text-[10px] text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" />
                    Website Link
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://hackathon-website-rules.com"
                    className="w-full rounded-lg glass-input py-2.5 px-3 text-sm font-sans font-light"
                  />
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-white/5">
              <button
                onClick={handleBuild}
                disabled={isLoading}
                className="flex-1 cursor-pointer py-3.5 px-6 rounded-lg bg-gradient-to-r from-primary to-primary-dark text-black font-extrabold tracking-wide hover:shadow-glow-yellow hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    CO-FOUNDER THINKING...
                  </>
                ) : (
                  <>
                    <Zap className="w-4.5 h-4.5 fill-black" />
                    ⚡ BUILD PROJECT PLAN
                  </>
                )}
              </button>
              
              <button
                onClick={handleStartChat}
                disabled={isLoading}
                className="py-3.5 px-6 cursor-pointer rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 font-semibold text-white tracking-wide transition-all flex items-center justify-center gap-2 font-mono text-sm"
              >
                <Send className="w-4 h-4" />
                START CHAT
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer credits */}
      <footer className="w-full text-center py-6 text-xs text-gray-500 font-mono relative z-10">
        <div>⚡ MINNALHACK - Accelerating Your Hackathon Victory</div>
      </footer>
    </div>
  );
};
