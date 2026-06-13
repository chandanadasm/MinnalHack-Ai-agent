import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { 
  analyzeRules, 
  chatWithCoFounder, 
  discoverIdeas, 
  evolveIdea, 
  generateBlueprint, 
  generateBuildPlan, 
  generatePitchAndSlides 
} from './services/gemini.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv from CWD, then from absolute path relative to this backend module
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Set up Multer for in-memory file uploads (PDFs, Images)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MINNALHACK Backend is running.' });
});

// 1. Rule Analyzer Endpoint (supports text, URL, file upload)
app.post('/api/rules/analyze', upload.single('file'), async (req, res) => {
  try {
    const { text, url } = req.body;
    let result;

    if (req.file) {
      result = await analyzeRules(
        req.file.buffer,
        req.file.mimetype,
        text,
        url
      );
    } else {
      result = await analyzeRules(
        undefined,
        undefined,
        text,
        url
      );
    }
    
    res.json(result);
  } catch (error: any) {
    console.error('Error analyzing rules:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze rules' });
  }
});

// 2. Co-Founder Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, onboardingState, projectMemory } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    const response = await chatWithCoFounder(messages, onboardingState, projectMemory);
    res.json(response);
  } catch (error: any) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message || 'Failed in co-founder chat' });
  }
});

// 3. Idea Discovery Endpoint
app.post('/api/ideas/discover', async (req, res) => {
  try {
    const { rules, onboarding, count } = req.body;
    const response = await discoverIdeas(rules, onboarding, count);
    res.json(response);
  } catch (error: any) {
    console.error('Error discovering ideas:', error);
    res.status(500).json({ error: error.message || 'Failed to discover ideas' });
  }
});

// 4. Idea Evolution Endpoint
app.post('/api/ideas/evolve', async (req, res) => {
  try {
    const { idea, suggestions, modifiers } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Idea object is required' });
    }
    const response = await evolveIdea(idea, suggestions || '', modifiers || []);
    res.json(response);
  } catch (error: any) {
    console.error('Error evolving idea:', error);
    res.status(500).json({ error: error.message || 'Failed to evolve idea' });
  }
});

// 5. Blueprint Generator Endpoint
app.post('/api/blueprint', async (req, res) => {
  try {
    const { idea, rules } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Selected idea is required' });
    }
    const response = await generateBlueprint(idea, rules);
    res.json(response);
  } catch (error: any) {
    console.error('Error generating blueprint:', error);
    res.status(500).json({ error: error.message || 'Failed to generate blueprint' });
  }
});

// 6. Build Plan Endpoint (includes roadmap, tool recommender, team allocation)
app.post('/api/build-plan', async (req, res) => {
  try {
    const { idea, blueprint, teamMembers } = req.body;
    if (!idea || !blueprint) {
      return res.status(400).json({ error: 'Idea and Blueprint are required' });
    }
    const response = await generateBuildPlan(idea, blueprint, teamMembers || []);
    res.json(response);
  } catch (error: any) {
    console.error('Error generating build plan:', error);
    res.status(500).json({ error: error.message || 'Failed to generate build plan' });
  }
});

// 7. Judge Room, Pitches & Slides Endpoint (Combined to save API latency)
app.post('/api/judge', async (req, res) => {
  try {
    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }
    const response = await generatePitchAndSlides(idea);
    res.json(response);
  } catch (error: any) {
    console.error('Error generating pitch and judge criteria:', error);
    res.status(500).json({ error: error.message || 'Failed to generate pitch and judge room' });
  }
});

// 8. Package Export Endpoint (returns downloadable Markdown text)
app.post('/api/export', (req, res) => {
  try {
    const { rules, onboarding, idea, blueprint, buildPlan, judgeData } = req.body;

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
    md += `* **Title:** ${idea?.title || 'N/A'}\n`;
    md += `* **Tagline:** ${idea?.tagline || 'N/A'}\n`;
    md += `* **Description:** ${idea?.description || 'N/A'}\n`;
    md += `* **Tech Stack:** ${(idea?.techStack || []).join(', ')}\n\n`;

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

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', 'attachment; filename="minnalhack-blueprint.md"');
    res.send(md);
  } catch (error: any) {
    console.error('Error exporting package:', error);
    res.status(500).json({ error: error.message || 'Failed to export package' });
  }
});

app.listen(port, () => {
  console.log(`⚡ MINNALHACK Backend listening at http://localhost:${port}`);
});
