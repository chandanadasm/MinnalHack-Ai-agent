import React from 'react';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { CinematicEntry } from './components/CinematicEntry';
import { LandingPage } from './components/LandingPage';
import { ProgressTracker } from './components/ProgressTracker';
import { Navigation } from './components/Navigation';
import { CoFounderChat } from './views/CoFounderChat';
import { IdeasModule } from './views/IdeasModule';
import { BlueprintModule } from './views/BlueprintModule';
import { BuildPlanModule } from './views/BuildPlanModule';
import { JudgeRoomModule } from './views/JudgeRoomModule';
import { FinalDemoModule } from './views/FinalDemoModule';

const DashboardContent: React.FC = () => {
  const { hasStarted, setHasStarted, activeTab } = useProject();

  // 1. Cinematic Entry Sequence is shown first
  if (!hasStarted) {
    return <CinematicEntry onComplete={() => setHasStarted(true)} />;
  }

  // 2. If session started but they haven't uploaded rules or chose a concept, show Landing Page
  const storedSession = localStorage.getItem('minnalhack_session');
  const sessionData = storedSession ? JSON.parse(storedSession) : null;
  const isSetup = sessionData?.rules || sessionData?.onboarding?.hackathonName || sessionData?.chatHistory?.length > 0;

  if (!isSetup) {
    return <LandingPage />;
  }

  // 3. Otherwise, render the active Hackathon Workspace
  return (
    <div className="min-h-screen bg-[#090909] text-gray-200 relative overflow-hidden flex flex-col justify-between electric-grid">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] ambient-purple opacity-20 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] ambient-blue opacity-20 filter blur-3xl pointer-events-none" />

      {/* Main Workspace Frame */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 flex-1 flex flex-col gap-6 relative z-10">
        
        {/* Progress Tracker on top */}
        <ProgressTracker />

        {/* Global tab navigation */}
        <Navigation />

        {/* Workspace views */}
        <main className="flex-1">
          {activeTab === 'chat' && <CoFounderChat />}
          {activeTab === 'ideas' && <IdeasModule />}
          {activeTab === 'blueprint' && <BlueprintModule />}
          {activeTab === 'build' && <BuildPlanModule />}
          {activeTab === 'judge' && <JudgeRoomModule />}
          {activeTab === 'demo' && <FinalDemoModule />}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-[10px] text-gray-600 font-mono relative z-10 border-t border-white/[0.02] bg-black/10">
        ⚡ MINNALHACK - Your AI Hackathon Co-Founder • Built with Gemini 2.5 Flash
      </footer>
    </div>
  );
};

function App() {
  return (
    <ProjectProvider>
      <DashboardContent />
    </ProjectProvider>
  );
}

export default App;
