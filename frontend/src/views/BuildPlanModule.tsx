import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { 
  ClipboardList, Calendar, Users, Cpu, Plus, Trash2, 
  CheckCircle, ShieldAlert, Sparkles, HelpCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BuildPlanModule: React.FC = () => {
  const { 
    selectedIdea, 
    blueprint, 
    buildPlan, 
    generateBuildPlanAPI, 
    teamMembers, 
    setTeamMembers, 
    isLoading 
  } = useProject();

  const [activeSubTab, setActiveSubTab] = useState<'roadmap' | 'team' | 'tools'>('roadmap');
  
  // Inputs to add new team members
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberSkills, setNewMemberSkills] = useState('');

  useEffect(() => {
    if (selectedIdea && blueprint && !buildPlan && !isLoading) {
      generateBuildPlanAPI();
    }
  }, [selectedIdea, blueprint, buildPlan]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberRole.trim()) return;
    
    const skills = newMemberSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setTeamMembers(prev => [
      ...prev,
      { name: newMemberName.trim(), role: newMemberRole.trim(), skills }
    ]);
    
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberSkills('');
  };

  const handleRemoveMember = (idx: number) => {
    setTeamMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const triggerReallocation = async () => {
    await generateBuildPlanAPI();
  };

  if (!selectedIdea || !blueprint) {
    return (
      <div className="max-w-md mx-auto text-center py-12 glass-panel border border-white/5 rounded-2xl p-6">
        <HelpCircle className="w-12 h-12 text-primary/45 mx-auto mb-4 animate-pulse" />
        <h3 className="text-sm font-bold text-white mb-2">Build Plan Locked</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please finalize your idea and load the blueprint specifications before preparing the developer build plan.
        </p>
      </div>
    );
  }

  if (isLoading && !buildPlan) {
    return (
      <div className="max-w-sm mx-auto text-center py-12 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-primary font-bold">CALCULATING SPRINT ROADMAP...</p>
      </div>
    );
  }

  if (!buildPlan) return null;

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display">Sprint Execution & Build Plan</h2>
          <p className="text-xs text-gray-400">Roadmaps, tool sets, and team sprints for {selectedIdea.title}</p>
        </div>

        {/* Sub Navigation */}
        <div className="flex rounded-lg p-1 bg-white/2 border border-white/5">
          {[
            { id: 'roadmap', label: 'Roadmap Timeline', icon: Calendar },
            { id: 'team', label: 'Team Allocation', icon: Users },
            { id: 'tools', label: 'AI Tools & Tasks', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
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

      {/* Tab 1: Roadmap Timeline */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500">48-72 HOUR MILESTONE SPRINT</span>
            <span className="text-[10px] font-mono text-primary font-bold">⚡ CHECK COMPLETED TASKS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(buildPlan.roadmap || []).map((phase: any, idx: number) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={idx}
                className="glass-panel border border-white/5 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono py-0.5 px-2 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
                      {phase.phase}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">PHASE {idx + 1}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{phase.title}</h3>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {(phase.tasks || []).map((task: string, tIdx: number) => (
                      <li key={tIdx} className="flex gap-2.5 items-start text-xs text-gray-400">
                        <input 
                          type="checkbox" 
                          className="mt-0.5 rounded border-white/10 accent-primary cursor-pointer"
                        />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Team Allocation Engine */}
      {activeSubTab === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Member Registration form */}
          <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4 h-fit">
            <h3 className="text-xs font-mono text-primary font-bold tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              TEAM REGISTRATION
            </h3>
            
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500">FULL NAME</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Alice Johnson"
                  className="w-full rounded-lg glass-input py-2 px-3 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500">ROLE</label>
                <input
                  type="text"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  placeholder="e.g. Lead Frontend Dev"
                  className="w-full rounded-lg glass-input py-2 px-3 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-gray-500">SKILLS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  value={newMemberSkills}
                  onChange={(e) => setNewMemberSkills(e.target.value)}
                  placeholder="e.g. React, Tailwind CSS, TS"
                  className="w-full rounded-lg glass-input py-2 px-3 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-primary text-black font-extrabold text-xs hover:shadow-glow-yellow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> ADD TEAM MEMBER
              </button>
            </form>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <span className="text-[10px] font-mono text-gray-500">REGISTERED MEMBERS</span>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {teamMembers.length === 0 && (
                  <p className="text-[10px] text-gray-600 italic">No custom team members. Using Lead Dev defaults.</p>
                )}
                {teamMembers.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded bg-white/2 border border-white/5">
                    <div>
                      <p className="text-xs font-bold text-white">{m.name}</p>
                      <p className="text-[9px] text-gray-500">{m.role}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveMember(idx)}
                      className="p-1 text-gray-500 hover:text-rose-400 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {teamMembers.length > 0 && (
              <button
                onClick={triggerReallocation}
                className="w-full py-3.5 rounded-lg border border-emerald-500/20 hover:border-emerald-500 text-emerald-400 hover:bg-emerald-500/5 font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> RE-ALLOCATE SPRINT ROLES
              </button>
            )}
          </div>

          {/* Allocation outputs */}
          <div className="lg:col-span-2 space-y-6">
            {(buildPlan.teamAllocation || []).map((alloc: any, idx: number) => (
              <div key={idx} className="glass-panel border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                {alloc.riskAlerts && alloc.riskAlerts.length > 0 && (
                  <div className="absolute top-0 right-0 bg-rose-500/10 border-l border-b border-rose-500/20 py-1 px-3 text-[9px] font-mono font-bold text-rose-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> SKILL GAP RISK
                  </div>
                )}
                
                <div className="border-b border-white/5 pb-3 mb-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                    {alloc.memberName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{alloc.memberName}</h3>
                    <p className="text-[10px] text-gray-400 font-mono tracking-wider">ALLOCATED SPRINTS</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-light">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-gray-500 block">RESPONSIBILITIES</span>
                    <ul className="space-y-1 text-gray-300">
                      {(alloc.responsibilities || []).map((resp: string, rIdx: number) => (
                        <li key={rIdx} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-primary font-bold block">ASSIGNED TIMELINE TASKS</span>
                    <ul className="space-y-1 text-gray-300">
                      {(alloc.tasks || []).map((tsk: string, tIdx: number) => (
                        <li key={tIdx} className="flex gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{tsk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {alloc.riskAlerts && alloc.riskAlerts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 font-bold block">RISK MITIGATION ACTIONS:</span>
                    <ul className="text-[10px] text-gray-500 space-y-0.5">
                      {alloc.riskAlerts.map((risk: string, rIdx: number) => (
                        <li key={rIdx} className="flex gap-1.5">
                          <span>⚠️</span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Tab 3: AI Tools & Task lists */}
      {activeSubTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Detailed Task Lists by Stack Layer */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { title: "FRONTEND COMPONENT BACKLOG", tasks: buildPlan.frontendTasks || [] },
              { title: "BACKEND EXPRESS ENDPOINTS", tasks: buildPlan.backendTasks || [] },
              { title: "LOCAL BROWSER DATA MOCKS", tasks: buildPlan.databaseTasks || [] },
              { title: "GEMINI PROMPT LAYER FUNCTIONS", tasks: buildPlan.aiTasks || [] },
              { title: "DEPLOYMENT PIPELINE TASKS", tasks: buildPlan.deploymentPlan || [] }
            ].map((layer, idx) => (
              <div key={idx} className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] font-mono text-gray-500 tracking-wider block border-b border-white/5 pb-2">
                  {layer.title}
                </span>
                
                <ul className="space-y-2">
                  {layer.tasks.length === 0 && (
                    <li className="text-[10px] text-gray-600 italic font-light">No task targets defined for this stack layer</li>
                  )}
                  {layer.tasks.map((task: string, tIdx: number) => (
                    <li key={tIdx} className="flex gap-2.5 items-start text-xs text-gray-300">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* AI Tools Recommender */}
          <div className="space-y-6">
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-mono text-primary font-bold tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                RECOMMENDED AI TOOLS
              </h3>
              
              <div className="space-y-4">
                {(buildPlan.toolRecommendations || []).map((tool: any, idx: number) => (
                  <div key={idx} className="space-y-1.5 p-3 rounded-lg bg-white/2 border border-white/5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{tool.name}</h4>
                      <span className="text-[8px] font-mono py-0.5 px-1 bg-primary/10 border border-primary/20 text-primary uppercase font-bold rounded">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-light leading-relaxed">{tool.reason}</p>
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
