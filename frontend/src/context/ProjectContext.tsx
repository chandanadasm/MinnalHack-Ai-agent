import React, { createContext, useContext, useState, useEffect } from 'react';

const API_BASE_URL = 'https://minnalhack-ai-agent.onrender.com/api';

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface Idea {
  id: string;
  title: string;
  tagline: string;
  description: string;
  innovationScore: number;
  feasibilityScore: number;
  judgeAppealScore: number;
  techStack: string[];
  mvpScope: string;
  whyItWins: string;
  features?: { name: string; description: string }[];
  architectureOverview?: string;
  winningStrategy?: string[];
}

export interface ProjectContextType {
  hasStarted: boolean;
  setHasStarted: (v: boolean) => void;
  activeTab: 'chat' | 'ideas' | 'blueprint' | 'build' | 'judge' | 'demo';
  setActiveTab: (tab: 'chat' | 'ideas' | 'blueprint' | 'build' | 'judge' | 'demo') => void;
  rules: any;
  setRules: (r: any) => void;
  onboarding: {
    hackathonName: string;
    theme: string;
    duration: string;
    teamSize: string;
    teamSkills: string[];
    goals: string[];
  };
  setOnboarding: React.Dispatch<React.SetStateAction<any>>;
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  ideas: Idea[];
  setIdeas: (i: Idea[]) => void;
  selectedIdea: Idea | null;
  setSelectedIdea: (i: Idea | null) => void;
  ideaVersions: Idea[];
  setIdeaVersions: (v: Idea[]) => void;
  blueprint: any;
  setBlueprint: (b: any) => void;
  buildPlan: any;
  setBuildPlan: (b: any) => void;
  judgeData: any;
  setJudgeData: (j: any) => void;
  teamMembers: { name: string; role: string; skills: string[] }[];
  setTeamMembers: React.Dispatch<React.SetStateAction<{ name: string; role: string; skills: string[] }[]>>;
  
  // API Call wrappers
  analyzeRulesAPI: (file: File | null, text: string, url: string) => Promise<any>;
  sendChatMessageAPI: (message: string) => Promise<any>;
  discoverIdeasAPI: (count: number) => Promise<any>;
  evolveIdeaAPI: (suggestions: string, modifiers: string[]) => Promise<any>;
  generateBlueprintAPI: () => Promise<any>;
  generateBuildPlanAPI: () => Promise<any>;
  generateJudgeAPI: () => Promise<any>;
  exportPackageAPI: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  resetSession: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'ideas' | 'blueprint' | 'build' | 'judge' | 'demo'>('chat');
  const [rules, setRules] = useState<any>(null);
  const [onboarding, setOnboarding] = useState<any>({
    hackathonName: '',
    theme: '',
    duration: '',
    teamSize: '1',
    teamSkills: [],
    goals: []
  });
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideaVersions, setIdeaVersions] = useState<Idea[]>([]);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [buildPlan, setBuildPlan] = useState<any>(null);
  const [judgeData, setJudgeData] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<{ name: string; role: string; skills: string[] }[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize and load from local storage if existing session
  useEffect(() => {
    try {
      const storedSession = localStorage.getItem('minnalhack_session');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        if (session.rules) setRules(session.rules);
        if (session.onboarding) setOnboarding(session.onboarding);
        if (session.chatHistory) setChatHistory(session.chatHistory);
        if (session.ideas) setIdeas(session.ideas);
        if (session.selectedIdea) setSelectedIdea(session.selectedIdea);
        if (session.ideaVersions) setIdeaVersions(session.ideaVersions);
        if (session.blueprint) setBlueprint(session.blueprint);
        if (session.buildPlan) setBuildPlan(session.buildPlan);
        if (session.judgeData) setJudgeData(session.judgeData);
        if (session.teamMembers) setTeamMembers(session.teamMembers);
        if (session.activeTab) setActiveTab(session.activeTab);
        setHasStarted(true);
      }
    } catch (e) {
      console.error('Failed to restore session from LocalStorage:', e);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (hasStarted) {
      const session = {
        rules,
        onboarding,
        chatHistory,
        ideas,
        selectedIdea,
        ideaVersions,
        blueprint,
        buildPlan,
        judgeData,
        teamMembers,
        activeTab
      };
      localStorage.setItem('minnalhack_session', JSON.stringify(session));
    }
  }, [rules, onboarding, chatHistory, ideas, selectedIdea, ideaVersions, blueprint, buildPlan, judgeData, teamMembers, activeTab, hasStarted]);

  const clearError = () => setError(null);

  const resetSession = () => {
    localStorage.removeItem('minnalhack_session');
    setRules(null);
    setOnboarding({
      hackathonName: '',
      theme: '',
      duration: '',
      teamSize: '1',
      teamSkills: [],
      goals: []
    });
    setChatHistory([]);
    setIdeas([]);
    setSelectedIdea(null);
    setIdeaVersions([]);
    setBlueprint(null);
    setBuildPlan(null);
    setJudgeData(null);
    setTeamMembers([]);
    setActiveTab('chat');
  };

  // 1. Analyze rules API
  const analyzeRulesAPI = async (file: File | null, text: string, url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('text', text);
      formData.append('url', url);

      const res = await fetch(`${API_BASE_URL}/rules/analyze`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error('Server returned an error');
      }
      const data = await res.json();
      setRules(data);
      if (data.theme && !onboarding.theme) {
        setOnboarding((prev: any) => ({ ...prev, theme: data.theme }));
      }
      setIsLoading(false);
      return data;
    } catch (err: any) {
      console.warn('Fallback to client mock for rule analyzer:', err);
      // Fallback response for demo resilience
      const mockRules = {
        summary: "A 48-hour development challenge focusing on using multimodal AI technologies to create impact.",
        theme: text || url || "AI Hackathon Challenge",
        constraints: ["Must use React + Node.js backend", "Must submit before checkout deadline", "Cannot utilize pre-built templates"],
        judgingCriteria: ["Innovation: Creative problem solving", "Technical execution: Functional MVP", "Presentation structure & clarity"],
        deliverables: ["2-Minute Video Demo", "Clean GitHub repository link", "Live deployment URL"],
        deadlines: ["Final submission in 48 hours", "Midpoint demo in 24 hours"],
        teamLimits: "1 to 5 members",
        submissionRequirements: ["Detailed project README file", "Functional URL endpoint"],
        judgePriorities: ["Working demo logic", "Clean visual layouts", "Real-world utility"],
        risks: ["API key exposure", "Over-complicated database sync paths"],
        opportunities: ["Adding accessibility voice-overs", "Structuring slide outlines early"],
        winningStrategy: ["Focus 100% on the core MVP demo first", "Formulate the judge presentation scripts early"]
      };
      setRules(mockRules);
      setIsLoading(false);
      return mockRules;
    }
  };

  // 2. Chat with Co-Founder API
  const sendChatMessageAPI = async (message: string) => {
    setIsLoading(true);
    setError(null);
    const updatedHistory: Message[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(updatedHistory);
    
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          onboardingState: onboarding,
          projectMemory: { rules, selectedIdea }
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      
      setChatHistory(prev => [...prev, { role: 'model', content: data.reply }]);
      if (data.extractedOnboarding) {
        setOnboarding(data.extractedOnboarding);
      }
      setIsLoading(false);
      return data;
    } catch (err) {
      console.warn('Fallback to client mock for chat response');
      const mockReply = `That sounds like a great direction! I've logged those details. Since we have a ${onboarding.duration || '48-hour'} timeframe, I suggest we finalize our skills matching and then head directly over to the Ideas Discovery section to generate some winning drafts. What do you think?`;
      const fallbackData = {
        reply: mockReply,
        extractedOnboarding: onboarding,
        suggestedPrompts: ["Let's find some project ideas", "Show me how our skills line up", "Let's review the constraints"]
      };
      setChatHistory(prev => [...prev, { role: 'model', content: mockReply }]);
      setIsLoading(false);
      return fallbackData;
    }
  };

  // 3. Discover Ideas API
  const discoverIdeasAPI = async (count: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/ideas/discover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules, onboarding, count }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setIdeas(data.ideas);
      setIsLoading(false);
      return data.ideas;
    } catch (err) {
      console.warn('Fallback to client mock for ideas discovery');
      const mockIdeas: Idea[] = [
        {
          id: 'idea-1',
          title: "CareSync AI Coordinator",
          tagline: "Automated medical triage & queue routing for remote emergency workers",
          description: "An AI-powered coordinator that extracts patient urgency markers from emergency reports and coordinates scheduling paths without manual dispatch.",
          innovationScore: 9,
          feasibilityScore: 8,
          judgeAppealScore: 9,
          techStack: ["React", "Express", "TailwindCSS", "Gemini API"],
          mvpScope: "Landing page, active patient queue, priority simulation nodes",
          whyItWins: "Addresses critical healthcare bottlenecks directly with visual cue mapping."
        },
        {
          id: 'idea-2',
          title: "ZeroWaste Routing Hub",
          tagline: "Dynamic AI matching for surplus food donations and shelters",
          description: "A real-time logistics optimizer that matches local bakery/supermarket excess with local shelter needs, designing short-haul collection runs.",
          innovationScore: 8,
          feasibilityScore: 9,
          judgeAppealScore: 8,
          techStack: ["React", "TailwindCSS", "Express", "Leaflet Maps"],
          mvpScope: "Donor intake desk, dispatch roadmap layout, and driver logs",
          whyItWins: "Feasible MVP scope that focuses on working UI rather than complex backend database syncs."
        },
        {
          id: 'idea-3',
          title: "EduPulse Accessibility Companion",
          tagline: "Multilingual transcription & interactive quizzing for online classrooms",
          description: "An AI assistant parsing live classroom screen data into localized notes, accessibility summaries, and regional voice overs.",
          innovationScore: 9,
          feasibilityScore: 8,
          judgeAppealScore: 9,
          techStack: ["React", "IndexedDB", "Web Speech API", "Gemini API"],
          mvpScope: "Transcription console, speech synthesizer settings, and generated cheat sheets",
          whyItWins: "Outstanding presentation value because the judge can click and hear translations instantly."
        }
      ];
      setIdeas(mockIdeas);
      setIsLoading(false);
      return mockIdeas;
    }
  };

  // 4. Evolve Idea API (V1 - V5)
  const evolveIdeaAPI = async (suggestions: string, modifiers: string[]) => {
    if (!selectedIdea) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/ideas/evolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: selectedIdea, suggestions, modifiers }),
      });
      if (!res.ok) throw new Error();
      const evolved = await res.json();
      
      const newVersion: Idea = {
        ...selectedIdea,
        ...evolved,
        id: selectedIdea.id
      };
      
      setSelectedIdea(newVersion);
      setIdeaVersions(prev => [...prev, newVersion]);
      setIsLoading(false);
      return newVersion;
    } catch (err) {
      console.warn('Fallback to client mock for idea evolution');
      const suffix = ` (V${ideaVersions.length + 2})`;
      const mockEvolved: Idea = {
        ...selectedIdea,
        title: selectedIdea.title.includes('Pro') ? selectedIdea.title : `${selectedIdea.title} Pro`,
        tagline: `${selectedIdea.tagline} [Refined with: ${modifiers.join(', ') || 'Custom suggestions'}]`,
        description: `${selectedIdea.description} Additionally optimized for: ${suggestions || 'general robustness'}. Includes regional localization capabilities and local caching syncs.`,
        techStack: [...selectedIdea.techStack, "IndexedDB", "Offline Service Workers"],
        features: [
          { name: "Multimodal Voice Assistant", description: "Speaks translations in target languages based on user context." },
          { name: "Browser IndexedDB Offline Queue", description: "Pipes server requests safely, storing states during outage." },
          { name: "Adaptive Layout Sizer", description: "Optimized mobile view layout for field volunteers." }
        ],
        architectureOverview: "Combines React Tailwind CSS layout with a localized IndexedDB storage layer and Express endpoints proxying prompts to Gemini.",
        winningStrategy: [
          "Demonstrate off-grid sync by switching off network manually during judging",
          "Ensure slide templates emphasize speed and accessibility integrations"
        ]
      };
      setSelectedIdea(mockEvolved);
      setIdeaVersions(prev => [...prev, mockEvolved]);
      setIsLoading(false);
      return mockEvolved;
    }
  };

  // 5. Generate Blueprint API
  const generateBlueprintAPI = async () => {
    if (!selectedIdea) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/blueprint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: selectedIdea, rules }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBlueprint(data);
      setIsLoading(false);
      return data;
    } catch (err) {
      console.warn('Fallback to client mock for blueprint generation');
      const mockBlueprint = {
        problemStatement: `Hackathons are intense, and teams lose major points because they over-scope or fail to link their feature list to the rules. ${selectedIdea.title} resolves this bottleneck by implementing a specialized, highly functional structure.`,
        constraintsAnalysis: "Fits the timeline constraints by removing database installations and utilizing local state management, ensuring setup takes less than 30 minutes.",
        solutionOverview: `An elegant workspace designed to implement ${selectedIdea.title}'s target operations with responsive dashboard layouts.`,
        coreFeatures: [
          { name: "AI Payload proxying", description: "Transmits queries directly to Gemini in real time." },
          { name: "Responsive local tracker", description: "Maintains files and progress cards dynamically in the browser." }
        ],
        architecture: "Client React SPA connected to Express proxy server. Uses local storage for saving sessions.",
        mvpScope: "The initial MVP focuses on demonstrating the main workflow, slide generator, and judge analytics.",
        competitiveAdvantage: "Extremely fast deployments, high visual fidelity, and native fallback support during presentations.",
        risks: ["Third-party API rate limits", "File uploads larger than 5MB"],
        recommendations: ["Ensure Gemini prompts are brief", "Use local browser syncs for speed"],
        diagramNodes: [
          { id: "user", label: "User / Hackathon Judge", type: "external" },
          { id: "frontend", label: "React Frontend App (Vite)", type: "frontend" },
          { id: "backend", label: "Express API Server (Node)", type: "backend" },
          { id: "gemini", label: "Google Gemini 2.5 Flash", type: "ai" }
        ],
        diagramEdges: [
          { from: "user", to: "frontend", label: "Interacts & Uploads" },
          { from: "frontend", to: "backend", label: "Sends JSON Payload" },
          { from: "backend", to: "gemini", label: "Enriches System Prompts" }
        ]
      };
      setBlueprint(mockBlueprint);
      setIsLoading(false);
      return mockBlueprint;
    }
  };

  // 6. Generate Build Plan API
  const generateBuildPlanAPI = async () => {
    if (!selectedIdea || !blueprint) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/build-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: selectedIdea, blueprint, teamMembers }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBuildPlan(data);
      setIsLoading(false);
      return data;
    } catch (err) {
      console.warn('Fallback to client mock for build plan generation');
      const mockBuildPlan = {
        frontendTasks: [
          "Set up React project and styles config",
          "Code glassmorphic form elements",
          "Implement animated circular score indicators",
          "Draw SVG flow path grids"
        ],
        backendTasks: [
          "Scaffold Node server structure",
          "Configure multer memory upload",
          "Configure Gemini prompt proxies"
        ],
        databaseTasks: [
          "Write localStorage sync controls",
          "Create state bindings"
        ],
        aiTasks: [
          "Refine Co-Founder onboarding feedback loops",
          "Optimize slides text layout outputs"
        ],
        deploymentPlan: [
          "Deploy client directly to Vercel/Netlify in seconds",
          "Deploy backend server to Render or Railway"
        ],
        toolRecommendations: [
          { category: "Coding", name: "v0 by Vercel", reason: "Creates sleek, customized layout blocks in seconds" },
          { category: "Design", name: "Lucide Icons", reason: "Standardized vector files for professional application layouts" },
          { category: "AI SDK", name: "Gemini 2.5 Flash", reason: "Offers multimodal analysis with low response latency" }
        ],
        teamAllocation: (teamMembers.length > 0 ? teamMembers : [{ name: "Lead Dev", role: "Fullstack Developer", skills: ["React", "Node"] }]).map((m, idx) => ({
          memberName: m.name,
          responsibilities: [`Drive ${m.role} integrations`],
          tasks: idx === 0 
            ? ["Install client dependencies", "Write Central State Context", "Link backend endpoints"]
            : ["Assemble landing forms", "Configure drag-drop files", "Format PPT slide decks"],
          timeline: "48-Hour sprint",
          riskAlerts: idx === 0 ? ["High work volume, potential bottleneck"] : []
        })),
        roadmap: [
          { phase: "0-3 Hours", title: "Project Scaffolding", tasks: ["Scaffold client folders", "Define CSS glow styles"] },
          { phase: "3-6 Hours", title: "Landing Design", tasks: ["Format glass main container", "Setup inputs"] },
          { phase: "6-12 Hours", title: "Backend Integrations", tasks: ["Connect Node server", "Setup Gemini credentials"] },
          { phase: "12-24 Hours", title: "Workspaces Configuration", tasks: ["Build Blueprint rendering", "Deploy test version"] },
          { phase: "24-36 Hours", title: "Refining UI Styles", tasks: ["Inject Framer Motion sliders", "Tune progress rings"] },
          { phase: "48 Hours", title: "Demo Prep", tasks: ["Save final Idea", "Prepare slide decks", "Formulate pitch scripts"] },
          { phase: "72 Hours", title: "Final Polish", tasks: ["Walk through presentation script", "Submit application"] }
        ]
      };
      setBuildPlan(mockBuildPlan);
      setIsLoading(false);
      return mockBuildPlan;
    }
  };

  // 7. Generate Judge Room details API
  const generateJudgeAPI = async () => {
    if (!selectedIdea) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/judge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: selectedIdea }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setJudgeData(data);
      setIsLoading(false);
      return data;
    } catch (err) {
      console.warn('Fallback to client mock for judge generation');
      const mockJudge = {
        slides: [
          { title: "The Problem", content: ["Developers struggle to finalize hackathon layouts", "Valuable dev time is wasted writing boilerplate APIs", "Presentations fall flat due to lack of structured outlines"], type: "problem", speakerNotes: "Start with an energetic question: 'Have you ever sat at a hackathon at 3 AM with zero slides ready?'" },
          { title: "The Solution: MINNALHACK", content: ["AI Co-founder in your browser", "Automated rules parsing & constraints verification", "Slide structures & pitch coaching built-in"], type: "solution", speakerNotes: "Introduce the hero. Explain that MINNALHACK gives every hacker an AI co-founder instantly." },
          { title: "System Architecture", content: ["React Client SPA (responsive layout)", "Stateless Node/Express proxy", "Multimodal Google Gemini 2.5 Flash engine"], type: "architecture", speakerNotes: "Walk through the diagram. Point out the zero-database architecture for lightning-fast speeds." },
          { title: "Core Features", content: ["Multimodal rules uploader", "Stateful conversational onboarding", "Live circular progress judge simulators"], type: "features", speakerNotes: "Briefly mention how all these pieces fit together to keep users motivated." },
          { title: "Unique Selling Proposition", content: ["Takes rules PDF/screenshots directly", "Offline fallback simulations", "Investor-demo ready styling"], type: "USP", speakerNotes: "Emphasize why this is a winning product, not just a simple layout." },
          { title: "Interactive Demo", content: ["Show the cinematic entry sequence", "Show loading animation prompts", "Show instant blueprint generation"], type: "demo", speakerNotes: "Keep this demo clean. If internet crashes, run offline mode." },
          { title: "Future Scope", content: ["Integration with GitHub Actions for automated pull-requests", "Voice-guided whiteboard UI layouts", "Collaborative team hubs"], type: "future", speakerNotes: "Explain that this is the first step of a venture-backed tool." },
          { title: "Winning Strategy", content: ["Deploy early and often", "Highlight modular features", "Deliver a polished demo video"], type: "closing", speakerNotes: "Wrap up with confidence. Open the floor to judge Q&A." }
        ],
        pitches: {
          s30: { script: `Meet ${selectedIdea.title || 'our project'} — a solution that transforms constraints into high-scoring project blueprints. It analyzes hackathon rules instantly, guides teams with co-founder feedback, and generates slide pitches, giving you a massive head start. Check it out now!`, opening: "Are you ready to win?", closing: "Start building today!" },
          s60: { script: `Every hackathon is a race against time. Teams lose hours debating ideas or building basic templates. That's why we created ${selectedIdea.title || 'our project'}. It operates as an AI co-founder in your browser. Upload rules, analyze constraints, generate winning roadmap sprints, and prepare slide presentations in seconds. It allows you to build what matters, fast.`, opening: "What if you could build a winning app in 12 hours?", closing: "Try it out and see the difference!" },
          m2: { script: `Imagine entering a hackathon with a powerful AI co-founder by your side. That's ${selectedIdea.title || 'our project'}. From the moment you upload rules, it parses constraints and extracts judging criteria. In the onboarding chat, it aligns your team's skills to the goal. Next, it discoveries ideas, refines versions from V1 to V5, and outlines visual blueprints. Finally, it scores your MVP in a simulated judge room and drafts slide scripts. This isn't just an app — it's your unfair advantage.`, opening: "Great teams aren't born, they are engineered.", closing: "Join us in revolutionizing development!" },
          m5: { script: `Hello judges. We've all seen projects fail because they lacked structure, over-scoped, or ran out of time. ${selectedIdea.title || 'our project'} is the AI Hackathon Mentor built to solve that. In phase 1, our multimodal analyzer handles rules, images, and links. Phase 2 leverages conversational chat to determine objectives. In phase 3, users discover ideas and evolve versions. Phase 4 creates blueprints with system flows. Phase 5 handles roadmaps, and phase 6 conducts pitch coaching with circular gauges. It is the ultimate tool for winning developers.`, opening: "Let's talk about the 3 AM hackathon bottleneck.", closing: "Thank you, and we're ready for your questions!" }
        },
        judgeRoom: {
          scores: { innovation: 9, feasibility: 8, scalability: 9, presentation: 9, judgeAppeal: 9 },
          winningProbability: 88,
          strengths: ["Clean glassmorphic presentation", "Zero-auth stateless setup", "Multimodal inputs"],
          weaknesses: ["Requires internet for AI API calls"],
          recommendations: ["Incorporate local storage offline fallback datasets"],
          feedback: "Highly impressive execution. Responsive screens and realistic features make this standout.",
          survivalGuide: [
            { scenario: "Gemini API Outage", fallbackPlan: "The server detects failures and loads high-fidelity mock data instantly, keeping the presentation running." },
            { scenario: "Internet Failure", fallbackPlan: "The client uses stored browser state to showcase mock slides and gauges without network lag." }
          ]
        }
      };
      setJudgeData(mockJudge);
      setIsLoading(false);
      return mockJudge;
    }
  };

  // 8. Export Package API (downloads file)
  const exportPackageAPI = () => {
    try {
      let md = `# ⚡ MINNALHACK AI Co-Founder - Winning Project Package\n\n`;
      md += `Exported on: ${new Date().toLocaleString()}\n\n`;
      
      md += `## 📋 HACKATHON RULES SUMMARY\n`;
      md += `* **Theme:** ${rules?.theme || 'AI Innovation'}\n`;
      md += `* **Summary:** ${rules?.summary || 'N/A'}\n`;
      md += `* **Constraints:**\n${(rules?.constraints || []).map((c: string) => `  - ${c}`).join('\n')}\n`;
      md += `* **Judging Criteria:**\n${(rules?.judgingCriteria || []).map((c: string) => `  - ${c}`).join('\n')}\n\n`;

      md += `## 👥 FOUNDER PROFILE & GOALS\n`;
      md += `* **Hackathon Name:** ${onboarding?.hackathonName || 'N/A'}\n`;
      md += `* **Team Size:** ${onboarding?.teamSize || '1'}\n`;
      md += `* **Team Skills:** ${(onboarding?.teamSkills || []).join(', ')}\n`;
      md += `* **Primary Goal:** ${(onboarding?.goals || []).join(', ')}\n\n`;

      md += `## 💡 SELECTED IDEA DETAILS\n`;
      md += `* **Title:** ${selectedIdea?.title || 'N/A'}\n`;
      md += `* **Tagline:** ${selectedIdea?.tagline || 'N/A'}\n`;
      md += `* **Description:** ${selectedIdea?.description || 'N/A'}\n`;
      md += `* **Tech Stack:** ${(selectedIdea?.techStack || []).join(', ')}\n\n`;

      md += `## 🛠️ ARCHITECTURAL BLUEPRINT\n`;
      md += `* **Problem Statement:** ${blueprint?.problemStatement || 'N/A'}\n`;
      md += `* **Solution Overview:** ${blueprint?.solutionOverview || 'N/A'}\n`;
      md += `* **MVP Scope:** ${blueprint?.mvpScope || 'N/A'}\n`;
      md += `* **System Architecture:** ${blueprint?.architecture || 'N/A'}\n\n`;

      md += `## 📅 BUILD ROADMAP\n`;
      if (buildPlan?.roadmap) {
        buildPlan.roadmap.forEach((phase: any) => {
          md += `### ${phase.phase} - ${phase.title}\n`;
          (phase.tasks || []).forEach((t: string) => {
            md += `- [ ] ${t}\n`;
          });
          md += `\n`;
        });
      }

      md += `## 🎙️ PITCH STUDIO SCRIPTS\n`;
      if (judgeData?.pitches) {
        md += `### 30-Second Elevator Pitch\n> ${judgeData.pitches.s30?.script || 'N/A'}\n\n`;
        md += `### 60-Second Hook\n> ${judgeData.pitches.s60?.script || 'N/A'}\n\n`;
        md += `### 2-Minute Sprint Pitch\n> ${judgeData.pitches.m2?.script || 'N/A'}\n\n`;
        md += `### 5-Minute Investor Pitch\n> ${judgeData.pitches.m5?.script || 'N/A'}\n\n`;
      }

      md += `## 🏆 JUDGE ROOM ESTIMATE\n`;
      md += `* **Estimated Winning Probability:** ${judgeData?.judgeRoom?.winningProbability || 'N/A'}%\n`;
      if (judgeData?.judgeRoom?.scores) {
        const s = judgeData.judgeRoom.scores;
        md += `* **Innovation:** ${s.innovation}/10\n`;
        md += `* **Feasibility:** ${s.feasibility}/10\n`;
        md += `* **Scalability:** ${s.scalability}/10\n`;
        md += `* **Presentation:** ${s.presentation}/10\n`;
        md += `* **Judge Appeal:** ${s.judgeAppeal}/10\n`;
      }

      const blob = new Blob([md], { type: 'text/markdown' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `minnalhack-${selectedIdea?.title.toLowerCase().replace(/\s+/g, '-') || 'blueprint'}-package.md`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to export package:', e);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        hasStarted,
        setHasStarted,
        activeTab,
        setActiveTab,
        rules,
        setRules,
        onboarding,
        setOnboarding,
        chatHistory,
        setChatHistory,
        ideas,
        setIdeas,
        selectedIdea,
        setSelectedIdea,
        ideaVersions,
        setIdeaVersions,
        blueprint,
        setBlueprint,
        buildPlan,
        setBuildPlan,
        judgeData,
        setJudgeData,
        teamMembers,
        setTeamMembers,
        analyzeRulesAPI,
        sendChatMessageAPI,
        discoverIdeasAPI,
        evolveIdeaAPI,
        generateBlueprintAPI,
        generateBuildPlanAPI,
        generateJudgeAPI,
        exportPackageAPI,
        isLoading,
        error,
        clearError,
        resetSession
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
