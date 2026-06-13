import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load dotenv from CWD, then from absolute path relative to this backend module
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// Initialize the Gemini SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai = null;
if (apiKey) {
    try {
        ai = new GoogleGenAI({ apiKey });
        console.log('⚡ Gemini API Client initialized successfully. API Key length:', apiKey.length);
    }
    catch (error) {
        console.error('❌ Failed to initialize Gemini API client:', error);
    }
}
else {
    console.warn('⚠️ WARNING: GEMINI_API_KEY is not set. All endpoints will operate in High-Fidelity Mock Mode.');
}
// Clean JSON response from potential markdown wrapping
function cleanJSONString(text) {
    let cleaned = text.trim();
    // Remove markdown code fences if present (e.g. ```json ... ```)
    if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '');
        cleaned = cleaned.replace(/\n?```$/, '');
    }
    return cleaned.trim();
}
// Helper to query Gemini with custom configuration
async function generateJSON(prompt, fallbackData) {
    if (!ai) {
        console.log('🤖 [Mock Mode] Client not initialized. Returning high-fidelity mock data.');
        return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    }
    try {
        console.log(`🤖 Querying Gemini API (Model: gemini-2.5-flash)...`);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });
        const text = response.text;
        if (!text) {
            throw new Error('Empty response received from Gemini API');
        }
        console.log('--- Raw Gemini API Response ---');
        console.log(text);
        console.log('-------------------------------');
        const cleaned = cleanJSONString(text);
        const parsed = JSON.parse(cleaned);
        console.log('✅ Successfully parsed Gemini JSON response.');
        return parsed;
    }
    catch (error) {
        console.error('❌ Gemini API Error:', error);
        console.log('⚠️ Falling back to high-fidelity mock data.');
        return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    }
}
// Helper to query Gemini with custom multimodal files
async function generateMultimodalJSON(prompt, fileBuffer, mimeType, fallbackData) {
    if (!ai) {
        console.log('🤖 [Mock Mode - Multimodal] Client not initialized. Returning high-fidelity mock data.');
        return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    }
    try {
        console.log(`🤖 Querying Gemini API Multimodal (Model: gemini-2.5-flash)...`);
        const filePart = {
            inlineData: {
                data: fileBuffer.toString('base64'),
                mimeType: mimeType
            }
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [filePart, prompt],
            config: {
                responseMimeType: 'application/json',
            }
        });
        const text = response.text;
        if (!text) {
            throw new Error('Empty response received from Gemini API');
        }
        console.log('--- Raw Multimodal Gemini API Response ---');
        console.log(text);
        console.log('------------------------------------------');
        const cleaned = cleanJSONString(text);
        const parsed = JSON.parse(cleaned);
        console.log('✅ Successfully parsed Gemini Multimodal JSON response.');
        return parsed;
    }
    catch (error) {
        console.error('❌ Gemini API Multimodal Error:', error);
        console.log('⚠️ Falling back to high-fidelity mock data.');
        return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    }
}
// ----------------------------------------------------
// Service Methods
// ----------------------------------------------------
export async function analyzeRules(fileBuffer, mimeType, rawText, url) {
    const systemPrompt = `You are MINNALHACK, the world's best AI Hackathon Co-Founder. Analyze the provided hackathon rules, constraints, or information.
If the input language is other than English, output all string properties in that regional language.
Extract the rules, deadlines, judging criteria, and deliverables. Then generate a high-impact winning strategy.

Return JSON in this format:
{
  "summary": "High-level summary of the hackathon",
  "theme": "Core theme or focus of the hackathon",
  "constraints": ["List of technical/rule constraints"],
  "judgingCriteria": ["List of key criteria judges look for"],
  "deliverables": ["List of final submission deliverables"],
  "deadlines": ["Deadlines, checkpoints, duration limits"],
  "teamLimits": "Minimum/maximum team sizes",
  "submissionRequirements": ["Required links, video demo length, writeup guidelines"],
  "judgePriorities": ["What the judges actually care about beyond written criteria"],
  "risks": ["Risk factors like tight timelines, complex APIs, over-scoping"],
  "opportunities": ["Unique angles, less crowded categories, accessibility focus"],
  "winningStrategy": ["Concrete steps to maximize probability of winning this hackathon"]
}`;
    const defaultMock = () => ({
        summary: "A high-stakes development sprint focused on building cutting-edge web applications utilizing artificial intelligence.",
        theme: "AI Hackathon Innovation Challenge",
        constraints: [
            "Must use React and Node.js",
            "Must deploy to a live URL for judging",
            "Maximum project cost under free tier limits"
        ],
        judgingCriteria: [
            "Innovation: Originality and creative application of technology",
            "Feasibility: Working prototype and technical execution",
            "Judge Appeal: Clear USP and visual polish",
            "Scalability: Potential to grow into a viable startup"
        ],
        deliverables: [
            "GitHub Repository link with README",
            "2-Minute Demo Video link (YouTube/Loom)",
            "Live deployed application URL"
        ],
        deadlines: [
            "Hackathon ends in 48 hours",
            "Midway checkpoint demo at Hour 24"
        ],
        teamLimits: "1 to 5 members",
        submissionRequirements: [
            "No pre-built templates except standard boilerplate",
            "List of APIs used in documentation"
        ],
        judgePriorities: [
            "Working live demo (judges hate slide-only presentations)",
            "Vibrant premium design styling",
            "Solving a tangible real-world problem"
        ],
        risks: [
            "API rate-limiting during presentation",
            "Over-complicating backend integrations",
            "Ineffective team coordination"
        ],
        opportunities: [
            "Integrating voice interfaces",
            "Adding a solid offline mode with PWA features",
            "Providing detailed speaker notes in presentation"
        ],
        winningStrategy: [
            "Build the core AI integration in the first 6 hours",
            "Deploy to hosting on day 1 to test environment",
            "Optimize presentation script and focus on a killer 30-second hook"
        ]
    });
    const promptText = rawText || url
        ? `Analyze this hackathon information:\n\nURL: ${url || 'N/A'}\n\nContent:\n${rawText || 'N/A'}\n\n${systemPrompt}`
        : `Analyze the attached rules document.\n\n${systemPrompt}`;
    if (fileBuffer && mimeType) {
        return generateMultimodalJSON(promptText, fileBuffer, mimeType, defaultMock);
    }
    return generateJSON(promptText, defaultMock);
}
export async function chatWithCoFounder(messages, onboardingState, projectMemory) {
    const formattedHistory = messages.map(m => `${m.role === 'user' ? 'Founder' : 'Co-Founder'}: ${m.content}`).join('\n');
    const systemPrompt = `You are MINNALHACK, an elite, venture-backed startup co-founder and mentor. You are chatting with the user to onboarding them into their hackathon preparation.
Your goals:
1. Guide them step-by-step to gather name, theme, duration, team size/skills, and goals (Win, Learn, MVP, Startup Validation).
2. Keep your answers short, enthusiastic, encouraging, and razor-sharp.
3. Automatically identify and extract key information when details are mentioned.
4. Always respond in the language used by the user. If they use Malayalam, Hindi, Tamil, or other regional languages, reply in that language.
5. Provide actionable guidance on what to do next.
6. CRITICAL: If the user asks a direct question (e.g. math questions like "What is 47 × 93?", coding help, or general facts), you MUST answer it directly and accurately first in the "reply" property (e.g., "47 × 93 is 4371.") before continuing with onboarding questions. Do not ignore user questions.

Current Project Context:
- Uploaded Rules Analysis: ${JSON.stringify(projectMemory?.rules || 'None')}
- Current Onboarding details collected: ${JSON.stringify(onboardingState || '{}')}
- Chat History:
${formattedHistory}

Return JSON in this format:
{
  "reply": "Your markdown-formatted, supportive, co-founder reply. Keep it to 1-2 paragraphs max.",
  "extractedOnboarding": {
    "hackathonName": "Name of hackathon (if mentioned or inferred, else preserve previous value)",
    "theme": "Hackathon theme (if mentioned, else preserve)",
    "duration": "Duration in hours/days (if mentioned, else preserve)",
    "teamSize": "Number of members (if mentioned, else preserve)",
    "teamSkills": ["Skills listed, e.g. React, Python, UI Design"],
    "goals": ["Win", "Learn", "MVP", "Prototype", "Startup Validation"]
  },
  "suggestedPrompts": ["3 short, relevant responses the user can click next. E.g. 'Our team knows React', 'We want to build an AI agent'"]
}`;
    const errorFallback = () => ({
        reply: "🤖 [MINNALHACK Connection Error]: The Gemini API Client is not initialized or returned an error. Please verify your GEMINI_API_KEY in backend/.env.",
        extractedOnboarding: onboardingState,
        suggestedPrompts: [
            "Check API Key in backend/.env",
            "Retry Onboarding Chat"
        ]
    });
    return generateJSON(`Execute co-founder chat flow.\n\n${systemPrompt}`, errorFallback);
}
export async function discoverIdeas(rules, onboarding, count = 3) {
    const systemPrompt = `You are MINNALHACK, the AI Hackathon Co-Founder. Generate ${count} high-scoring, winning project ideas customized for this hackathon and team.
Team Skills: ${JSON.stringify(onboarding?.teamSkills || [])}
Hackathon Theme/Rules: ${JSON.stringify(rules || 'Generic AI hackathon')}
Goals: ${JSON.stringify(onboarding?.goals || ['Win'])}

Each idea must feel like a venture-backed startup product, not a student project.
If input information suggests a specific regional language or user query is in a regional language, translate string fields in the response.

Return JSON in this format:
{
  "ideas": [
    {
      "id": "unique-id-1",
      "title": "Winning Project Title",
      "tagline": "Sleek, professional pitch tagline",
      "description": "Comprehensive description of the product and how it fits the hackathon goals.",
      "innovationScore": 9,
      "feasibilityScore": 8,
      "judgeAppealScore": 9,
      "techStack": ["React", "Express", "TailwindCSS", "Framer Motion", "Gemini API"],
      "mvpScope": "Clear definition of what to build in 48 hours.",
      "whyItWins": "Key differentiator that appeals to judges (e.g. high-fidelity UI, actual utility, solving judge pain point)"
    }
  ]
}`;
    const defaultMock = () => ({
        ideas: Array.from({ length: count }).map((_, i) => ({
            id: `idea-${i + 1}`,
            title: i === 0 ? "CareSync AI" : i === 1 ? "ZeroWaste Logistics" : "EduPulse Interactive",
            tagline: i === 0 ? "Predictive Patient Care Routing for Rural Clinics" : "Dynamic Route Allocation for Food Recovery Agents",
            description: i === 0
                ? "An AI-powered routing and scheduling coordinator for clinics that automates dispatch based on patient severity levels."
                : "Real-time AI matching engine for food pantries and excess suppliers, calculating optimum collection paths.",
            innovationScore: 8 + (i % 2),
            feasibilityScore: 7 + (i % 2),
            judgeAppealScore: 9,
            techStack: ["React", "Node.js", "Express", "TailwindCSS", "Gemini 2.5 Flash", "Leaflet Maps"],
            mvpScope: "Landing page, interactive routing dashboard showing simulated live dispatches, and emergency broadcast center.",
            whyItWins: "Solves a critical real-world logistics bottleneck with working mapping visuals and immediate AI classification."
        }))
    });
    return generateJSON(`Discover ideas.\n\n${systemPrompt}`, defaultMock);
}
export async function evolveIdea(idea, suggestions, modifiers) {
    const systemPrompt = `You are MINNALHACK, the AI Co-Founder. Evolve the project idea.
Add the requested modifiers (e.g. Add Offline Mode, Add Accessibility, Add AI features, Improve Scalability, Reduce Scope).
Incorporate the user's custom suggestions: "${suggestions}".
Create a refined, premium version of this project idea.

Return JSON in this format:
{
  "title": "Updated or Refined Project Title",
  "tagline": "Refined punchy tagline",
  "description": "Upgraded, comprehensive project description reflecting additions.",
  "features": [
    { "name": "Feature Title", "description": "How it works and value add" }
  ],
  "techStack": ["React", "TypeScript", "TailwindCSS", "Express", "Gemini API"],
  "architectureOverview": "Brief summary of client-server interaction and AI integration flow",
  "winningStrategy": ["Strategy item 1", "Strategy item 2"]
}`;
    const defaultMock = () => ({
        title: idea.title + " Pro",
        tagline: idea.tagline + " with Advanced Intelligent Fail-safes",
        description: idea.description + " Evolved to include offline capabilities, accessibility interfaces, and a refined execution workflow.",
        features: [
            { name: "Multimodal Priority Analyzer", description: "Classifies urgencies using voice or images in real-time." },
            { name: "Adaptive Offline Syncing", description: "Buffers outgoing reports locally in IndexedDB when internet fails, pushing data seamlessly upon reconnection." },
            { name: "Voice-guided Command Line", description: "Hands-free navigation support designed for accessibility." }
        ],
        techStack: [...(idea.techStack || []), "IndexedDB", "Web Speech API"],
        architectureOverview: "Client UI uses Tailwind & local state, backing up inputs to browser storage, interacting with stateless Node/Express API proxy for Gemini prompts.",
        winningStrategy: [
            "Highlight the Offline support during demo (simulate disconnecting wifi)",
            "Focus on the AI routing efficiency metric in the pitch slides"
        ]
    });
    return generateJSON(`Evolve idea.\n\nIdea details: ${JSON.stringify(idea)}\nSuggestions: ${suggestions}\nModifiers: ${modifiers.join(', ')}\n\n${systemPrompt}`, defaultMock);
}
export async function generateBlueprint(idea, rules) {
    const systemPrompt = `You are MINNALHACK. Generate a complete, high-fidelity project Blueprint for this selected idea.
Theme & Constraints: ${JSON.stringify(rules || {})}
Idea Details: ${JSON.stringify(idea)}

Provide deep architectural blueprints, problem analysis, and scope details. Also, define a visual system architecture graph (nodes and edges) that can be rendered dynamically in the UI.

Return JSON in this format:
{
  "problemStatement": "A clean, compelling description of the problem solved.",
  "constraintsAnalysis": "How the blueprint complies with hackathon time and tool limits.",
  "solutionOverview": "How this application uniquely resolves the problem.",
  "coreFeatures": [
    { "name": "Feature 1", "description": "Value and design approach" }
  ],
  "architecture": "Overview of technical system architecture (Stateless backend, browser session memory, Gemini API layers).",
  "mvpScope": "Granular scope of what is included in the MVP and what is post-hackathon scope.",
  "competitiveAdvantage": "Why this project stands out over standard CRUD apps.",
  "risks": ["Risk 1", "Risk 2"],
  "recommendations": ["Actionable recommendation 1", "Actionable recommendation 2"],
  "diagramNodes": [
    { "id": "client", "label": "React Client (Tailwind & Framer Motion)", "type": "frontend" },
    { "id": "server", "label": "Express API Server (Node)", "type": "backend" },
    { "id": "gemini", "label": "Google Gemini 2.5 Flash API", "type": "ai" }
  ],
  "diagramEdges": [
    { "from": "client", "to": "server", "label": "REST API Requests" },
    { "from": "server", "to": "gemini", "label": "Multimodal Prompt Payload" }
  ]
}`;
    const defaultMock = () => ({
        problemStatement: `Hackathons demand rapid delivery of functional products, yet developers often waste precious hours configuring infrastructure instead of polishing user-facing innovation. ${idea.title} addresses this bottleneck by providing a structured layout.`,
        constraintsAnalysis: "Fits perfectly within a 48-hour timeline by omitting user authentication and heavy databases, utilizing browser localStorage and a stateless backend.",
        solutionOverview: `An intuitive tool designed to implement ${idea.title}'s core proposition with visual cues and conversational guidance.`,
        coreFeatures: [
            { name: "Stateless Processing Gateway", description: "Proxies requests to Gemini API securely without storing user files permanently." },
            { name: "Responsive Workspace", description: "A beautifully animated dashboard displaying real-time updates and flow paths." }
        ],
        architecture: "Uses a decoupled design with a React SPA client and an Express proxy server, relying on local session storage for state retention.",
        mvpScope: "The initial MVP focuses on demonstrating the AI reasoning path, generating slide models, and simulated test scripts.",
        competitiveAdvantage: "Avoids complex cloud server deployments by offering 100% client-side memory caching, allowing deployment in minutes.",
        risks: ["Third-party API rate limits", "File uploads larger than 5MB"],
        recommendations: ["Keep Gemini instructions concise", "Implement client-side compressions for images"],
        diagramNodes: [
            { id: "user", label: "User / Hackathon Judge", type: "external" },
            { id: "frontend", label: "React Frontend App", type: "frontend" },
            { id: "backend", label: "Express API Server", type: "backend" },
            { id: "gemini", label: "Gemini 2.5 Flash", type: "ai" }
        ],
        diagramEdges: [
            { from: "user", to: "frontend", label: "Interacts & Uploads" },
            { from: "frontend", to: "backend", label: "Sends Payload" },
            { from: "backend", to: "gemini", label: "Enriches Prompt & Calls" }
        ]
    });
    return generateJSON(`Generate blueprint.\n\nIdea: ${JSON.stringify(idea)}\n\n${systemPrompt}`, defaultMock);
}
export async function generateBuildPlan(idea, blueprint, teamMembers) {
    const systemPrompt = `You are MINNALHACK. Generate a detailed, granular Build Plan, Roadmap, and Team Allocations for the next 48 hours.
Idea: ${JSON.stringify(idea)}
Blueprint: ${JSON.stringify(blueprint)}
Team: ${JSON.stringify(teamMembers)}

Generate a timeline mapping tasks from hour 0 to hour 72. Provide specific team roles and assignments. Recommend top-tier developer/AI productivity tools.

Return JSON in this format:
{
  "frontendTasks": ["List of frontend items to build"],
  "backendTasks": ["List of backend endpoints and features"],
  "databaseTasks": ["List of local browser storage structures to mock/store"],
  "aiTasks": ["AI prompt optimizations and functions"],
  "deploymentPlan": ["Hosting options (Vercel, Render) and setup steps"],
  "toolRecommendations": [
    { "category": "Coding/Design/Database", "name": "Tool Name", "reason": "Why it helps save hours" }
  ],
  "teamAllocation": [
    {
      "memberName": "Name",
      "responsibilities": ["Primary areas of ownership"],
      "tasks": ["Assigned timeline tasks"],
      "timeline": "Sprint duration description",
      "riskAlerts": ["Risk of overloading or skill gap"]
    }
  ],
  "roadmap": [
    { "phase": "0-3 Hours", "title": "Onboarding & Scaffolding", "tasks": ["Task 1", "Task 2"] },
    { "phase": "3-6 Hours", "title": "Core UI & Backend Setup", "tasks": ["Task 3"] },
    { "phase": "6-12 Hours", "title": "AI Integrations", "tasks": ["Task 4"] },
    { "phase": "12-24 Hours", "title": "Dashboard Operations", "tasks": ["Task 5"] },
    { "phase": "24-36 Hours", "title": "Feature Complete & Polish", "tasks": ["Task 6"] },
    { "phase": "48 Hours", "title": "Demo Recording & Pitch prep", "tasks": ["Task 7"] },
    { "phase": "72 Hours", "title": "Hackathon Submission", "tasks": ["Task 8"] }
  ]
}`;
    const defaultMock = () => ({
        frontendTasks: [
            "Set up React Vite template with Tailwind CSS",
            "Develop responsive sidebar and workspace tabs",
            "Implement SVG flow rendering engine",
            "Build animatedCircularProgress indicator component"
        ],
        backendTasks: [
            "Set up Express server structure with CORS",
            "Configure multer memory upload middlewares",
            "Establish Gemini payload routing endpoints"
        ],
        databaseTasks: [
            "Create browser localStorage manager helper",
            "Initialize application state hooks"
        ],
        aiTasks: [
            "Tune co-founder system prompts",
            "Optimize slide structure layouts"
        ],
        deploymentPlan: [
            "Deploy frontend to Vercel/Netlify in 1 click",
            "Deploy Express backend to Render or Railway"
        ],
        toolRecommendations: [
            { category: "Coding", name: "v0 by Vercel", reason: "Generates beautiful Tailwind mock UI templates in seconds" },
            { category: "Design", name: "Lucide Icons", reason: "Clean, consistent, highly-professional vector icons ready for React" },
            { category: "AI Layer", name: "Gemini 2.5 Flash", reason: "Extremely fast token processing with multi-modal file support" }
        ],
        teamAllocation: (teamMembers.length > 0 ? teamMembers : [{ name: "Lead Dev", role: "Fullstack Developer", skills: ["React", "Node"] }]).map((m, idx) => ({
            memberName: m.name,
            responsibilities: [`Lead ${m.role} tasks and feature integrations`],
            tasks: idx === 0
                ? ["Scaffold codebase", "Build central state", "Setup Gemini backend endpoints"]
                : ["Design layouts", "Create landing inputs", "Construct pitch presentation UI"],
            timeline: "48-Hour sprint",
            riskAlerts: idx === 0 ? ["High work volume, potential bottleneck"] : []
        })),
        roadmap: [
            { phase: "0-3 Hours", title: "Project Scaffolding", tasks: ["Scaffold client/server folders", "Configure Tailwind style tokens"] },
            { phase: "3-6 Hours", title: "Core Landing & Inputs", tasks: ["Code glassmorphic main entry form", "Implement file drag-drop capabilities"] },
            { phase: "6-12 Hours", title: "API Connections", tasks: ["Connect Express server", "Validate Gemini API parsing credentials"] },
            { phase: "12-24 Hours", title: "Functional Workspaces", tasks: ["Build Blueprint diagram layout", "Integrate chat dialog features"] },
            { phase: "24-36 Hours", title: "Polishing & Micro-animations", tasks: ["Inject Framer Motion sliders", "Integrate Judge Score gaugers"] },
            { phase: "48 Hours", title: "Showcase Readiness", tasks: ["Lock Idea version", "Draft pitch variations", "Export final blueprints"] },
            { phase: "72 Hours", title: "Final Polish", tasks: ["Conduct demo run-through", "Submit project details"] }
        ]
    });
    return generateJSON(`Generate build plan.\n\nIdea: ${JSON.stringify(idea)}\n\n${systemPrompt}`, defaultMock);
}
export async function generatePitchAndSlides(idea) {
    const systemPrompt = `You are MINNALHACK. Generate:
1. An 8-slide presentation deck layout.
2. Pitch scripts for multiple durations and styles.
3. Judge simulated scores and survival guide.

Return JSON in this format:
{
  "slides": [
    { "title": "Slide Title", "content": ["Bullet 1", "Bullet 2"], "type": "problem/solution/architecture/USP/demo/future/closing", "speakerNotes": "Guidance on how to present this slide" }
  ],
  "pitches": {
    "s30": { "script": "30 second pitch", "opening": "Hook", "closing": "Call to action" },
    "s60": { "script": "60 second pitch", "opening": "Hook", "closing": "Call to action" },
    "m2": { "script": "2 minute pitch", "opening": "Hook", "closing": "Call to action" },
    "m5": { "script": "5 minute pitch", "opening": "Hook", "closing": "Call to action" }
  },
  "judgeRoom": {
    "scores": { "innovation": 9, "feasibility": 8, "scalability": 9, "presentation": 9, "judgeAppeal": 9 },
    "winningProbability": 88,
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1"],
    "recommendations": ["Recommendation 1"],
    "feedback": "Overall judge perspective summary",
    "survivalGuide": [
      { "scenario": "API Failure", "fallbackPlan": "Pre-cache static mock JSON logs inside frontend to simulate responses instantaneously." },
      { "scenario": "Internet Failure", "fallbackPlan": "Run a localhost offline replica of the client node." }
    ]
  }
}`;
    const defaultMock = () => ({
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
            s30: { script: `Meet ${idea.title || 'our project'} — a solution that transforms constraints into high-scoring project blueprints. It analyzes hackathon rules instantly, guides teams with co-founder feedback, and generates slide pitches, giving you a massive head start. Check it out now!`, opening: "Are you ready to win?", closing: "Start building today!" },
            s60: { script: `Every hackathon is a race against time. Teams lose hours debating ideas or building basic templates. That's why we created ${idea.title || 'our project'}. It operates as an AI co-founder in your browser. Upload rules, analyze constraints, generate winning roadmap sprints, and prepare slide presentations in seconds. It allows you to build what matters, fast.`, opening: "What if you could build a winning app in 12 hours?", closing: "Try it out and see the difference!" },
            m2: { script: `Imagine entering a hackathon with a powerful AI co-founder by your side. That's ${idea.title || 'our project'}. From the moment you upload rules, it parses constraints and extracts judging criteria. In the onboarding chat, it aligns your team's skills to the goal. Next, it discoveries ideas, refines versions from V1 to V5, and outlines visual blueprints. Finally, it scores your MVP in a simulated judge room and drafts slide scripts. This isn't just an app — it's your unfair advantage.`, opening: "Great teams aren't born, they are engineered.", closing: "Join us in revolutionizing development!" },
            m5: { script: `Hello judges. We've all seen projects fail because they lacked structure, over-scoped, or ran out of time. ${idea.title || 'our project'} is the AI Hackathon Mentor built to solve that. In phase 1, our multimodal analyzer handles rules, images, and links. Phase 2 leverages conversational chat to determine objectives. In phase 3, users discover ideas and evolve versions. Phase 4 creates blueprints with system flows. Phase 5 handles roadmaps, and phase 6 conducts pitch coaching with circular gauges. It is the ultimate tool for winning developers.`, opening: "Let's talk about the 3 AM hackathon bottleneck.", closing: "Thank you, and we're ready for your questions!" }
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
    });
    return generateJSON(`Generate pitches and slides.\n\nIdea: ${JSON.stringify(idea)}\n\n${systemPrompt}`, defaultMock);
}
