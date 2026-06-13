import React from 'react';
import { useProject } from '../context/ProjectContext';
import { MessageSquare, Lightbulb, GitFork, ClipboardList, Award, MonitorPlay, LogOut } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab, resetSession } = useProject();

  const navItems = [
    { id: 'chat', label: 'Co-Founder Chat', icon: MessageSquare },
    { id: 'ideas', label: 'Ideas Discovery', icon: Lightbulb },
    { id: 'blueprint', label: 'Blueprint', icon: GitFork },
    { id: 'build', label: 'Build Plan', icon: ClipboardList },
    { id: 'judge', label: 'Judge Room', icon: Award },
    { id: 'demo', label: 'Showcase Mode', icon: MonitorPlay }
  ] as const;

  return (
    <div className="w-full glass-panel border border-white/5 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Connection */}
      <div className="flex items-center gap-3">
        <span className="font-display font-extrabold tracking-wider text-sm text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FFE483] flex items-center gap-1.5">
          ⚡ MINNAL
        </span>
        <span className="h-4 w-px bg-white/10" />
        <span className="text-[10px] font-mono py-0.5 px-1.5 rounded bg-primary/10 border border-primary/20 text-primary">
          SESSION MEMORY ACTIVE
        </span>
      </div>

      {/* Tabs */}
      <nav className="flex flex-wrap items-center gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`py-2 px-3.5 rounded-lg text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-black font-extrabold shadow-glow-yellow' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Control Actions */}
      <div>
        <button
          onClick={() => {
            if (confirm("Reset current session? You will lose uploaded rules and selections.")) {
              resetSession();
              window.location.reload();
            }
          }}
          className="py-1.5 px-2.5 cursor-pointer rounded-lg text-[10px] font-mono font-bold border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 transition-all flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          RESET SPREE
        </button>
      </div>
    </div>
  );
};
