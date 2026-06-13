import React, { useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { GitFork, Sparkles, ShieldAlert, Cpu, Layers, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const BlueprintModule: React.FC = () => {
  const { selectedIdea, blueprint, generateBlueprintAPI, isLoading } = useProject();

  useEffect(() => {
    if (selectedIdea && !blueprint && !isLoading) {
      generateBlueprintAPI();
    }
  }, [selectedIdea, blueprint]);

  if (!selectedIdea) {
    return (
      <div className="max-w-md mx-auto text-center py-12 glass-panel border border-white/5 rounded-2xl p-6">
        <HelpCircle className="w-12 h-12 text-primary/45 mx-auto mb-4 animate-pulse" />
        <h3 className="text-sm font-bold text-white mb-2">No Idea Finalized Yet</h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          Please select and finalize a project idea in the Ideas Discovery view before generating a technical blueprint.
        </p>
      </div>
    );
  }

  if (isLoading && !blueprint) {
    return (
      <div className="max-w-sm mx-auto text-center py-12 flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-primary font-bold">GENERATING SYSTEM BLUEPRINT...</p>
      </div>
    );
  }

  if (!blueprint) return null;

  // Layout Nodes on a clean 2D grid for the SVG architecture rendering
  // Columns/Layers: external -> frontend -> backend -> ai/db
  const nodes = blueprint.diagramNodes || [];
  const edges = blueprint.diagramEdges || [];

  const getLayerIndex = (type: string) => {
    switch (type) {
      case 'external': return 0;
      case 'frontend': return 1;
      case 'backend': return 2;
      case 'ai':
      case 'database': return 3;
      default: return 1;
    }
  };

  // Group nodes by layer to calculate Y coordinates
  const layers: { [key: number]: any[] } = { 0: [], 1: [], 2: [], 3: [] };
  nodes.forEach((node: any) => {
    const layer = getLayerIndex(node.type);
    layers[layer].push(node);
  });

  const nodePositions: { [key: string]: { x: number; y: number } } = {};
  const containerWidth = 760;
  const containerHeight = 300;

  Object.keys(layers).forEach((layerKey) => {
    const layerIdx = parseInt(layerKey);
    const layerNodes = layers[layerIdx];
    const x = layerIdx * 200 + 70; // x-position spacing

    layerNodes.forEach((node, idx) => {
      // center y-position
      const totalNodesInLayer = layerNodes.length;
      const spacing = containerHeight / (totalNodesInLayer + 1);
      const y = spacing * (idx + 1);
      nodePositions[node.id] = { x, y };
    });
  });

  return (
    <div className="space-y-6">
      
      {/* Generate trigger if changed */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white font-display">System Architecture Blueprint</h2>
          <p className="text-xs text-gray-400">Technical design templates for {selectedIdea.title}</p>
        </div>
        <button
          onClick={generateBlueprintAPI}
          disabled={isLoading}
          className="py-1.5 px-3.5 cursor-pointer rounded-lg border border-primary/20 hover:border-primary bg-primary/5 text-primary text-xs font-mono font-bold transition-all disabled:opacity-50"
        >
          {isLoading ? "REFRESHING..." : "⚡ REGENERATE BLUEPRINT"}
        </button>
      </div>

      {/* SVG System Flow Diagram */}
      <div className="glass-panel border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        <h3 className="text-xs font-mono text-primary font-bold tracking-wider mb-4 flex items-center gap-1.5">
          <GitFork className="w-4 h-4" />
          VISUAL SYSTEM ARCHITECTURE FLOW
        </h3>
        
        {/* SVG Container */}
        <div className="w-full overflow-x-auto bg-black/40 rounded-xl border border-white/5 p-4 flex justify-center">
          <svg width={containerWidth} height={containerHeight} className="min-w-[700px]">
            {/* Draw connections */}
            {edges.map((edge: any, idx: number) => {
              const start = nodePositions[edge.from];
              const end = nodePositions[edge.to];
              if (!start || !end) return null;

              // Draw bezier curving lines
              const dx = end.x - start.x;
              const mx = start.x + dx / 2;
              const pathStr = `M ${start.x} ${start.y} C ${mx} ${start.y}, ${mx} ${end.y}, ${end.x} ${end.y}`;

              return (
                <g key={idx}>
                  <path
                    d={pathStr}
                    fill="none"
                    stroke="rgba(255, 213, 74, 0.15)"
                    strokeWidth="2"
                  />
                  <path
                    d={pathStr}
                    fill="none"
                    stroke="#FFD54A"
                    strokeWidth="1.5"
                    strokeDasharray="6 6"
                    className="animate-[move-bg_20s_linear_infinite]"
                    style={{ strokeDashoffset: -idx * 50 }}
                  />
                  {edge.label && (
                    <text
                      x={mx}
                      y={((start.y + end.y) / 2) - 6}
                      textAnchor="middle"
                      fill="#8b949e"
                      fontSize="9"
                      fontFamily="monospace"
                      className="bg-black py-0.5 px-1 font-semibold"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Draw Node Boxes */}
            {nodes.map((node: any) => {
              const pos = nodePositions[node.id];
              if (!pos) return null;

              const isClient = node.type === 'frontend';
              const isServer = node.type === 'backend';
              const isAI = node.type === 'ai';
              const isExternal = node.type === 'external';

              let color = 'border-white/10 bg-white/5 text-gray-300';
              if (isClient) color = 'border-blue-500/30 bg-blue-500/5 text-blue-400';
              if (isServer) color = 'border-purple-500/30 bg-purple-500/5 text-purple-400';
              if (isAI) color = 'border-primary/30 bg-primary/5 text-primary';

              return (
                <g key={node.id} transform={`translate(${pos.x - 75}, ${pos.y - 25})`}>
                  <rect
                    width="150"
                    height="50"
                    rx="8"
                    className={`${color.split(' ')[0]} ${color.split(' ')[1]} border transition-all duration-300`}
                    strokeWidth="1.5"
                  />
                  <text
                    x="75"
                    y="24"
                    textAnchor="middle"
                    fill={isAI ? '#FFD54A' : isClient ? '#60a5fa' : isServer ? '#c084fc' : '#e5e7eb'}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    {node.label.length > 22 ? `${node.label.slice(0, 20)}...` : node.label}
                  </text>
                  <text
                    x="75"
                    y="38"
                    textAnchor="middle"
                    fill="#6e7681"
                    fontSize="8"
                    fontFamily="monospace"
                  >
                    {node.type.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Blueprint core details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Problem & Solution Statement */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-gray-500">PROBLEM STATEMENT</span>
            <p className="text-xs text-gray-300 leading-relaxed font-light">{blueprint.problemStatement}</p>
          </div>
          <hr className="border-white/5" />
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-primary font-bold">⚡ SOLUTION OVERVIEW</span>
            <p className="text-xs text-gray-300 leading-relaxed font-light">{blueprint.solutionOverview}</p>
          </div>
        </div>

        {/* Feature outline */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] font-mono text-gray-500">CORE FEATURE SPECIFICATIONS</span>
          <div className="space-y-3">
            {(blueprint.coreFeatures || []).map((feat: any, idx: number) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">{feat.name}</h4>
                  <p className="text-[11px] text-gray-400 font-light leading-snug">{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical overview & MVP limitations */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
          <div>
            <span className="text-[10px] font-mono text-gray-500 block mb-1">SYSTEM INFRASTRUCTURE</span>
            <p className="text-xs text-gray-400 font-light leading-relaxed">{blueprint.architecture}</p>
          </div>
          <hr className="border-white/5" />
          <div>
            <span className="text-[10px] font-mono text-gray-500 block mb-1">MVP SPRINT LIMITS</span>
            <p className="text-xs text-gray-400 font-light leading-relaxed">{blueprint.mvpScope}</p>
          </div>
        </div>

        {/* Advantage & Compliance */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">COMPETITIVE ADVANTAGE</span>
            <p className="text-xs text-gray-300 leading-relaxed font-light">{blueprint.competitiveAdvantage}</p>
          </div>
          <hr className="border-white/5" />
          <div>
            <span className="text-[10px] font-mono text-gray-500 block mb-1">RULES & TIME COMPLIANCE</span>
            <p className="text-xs text-gray-400 font-light leading-relaxed">{blueprint.constraintsAnalysis}</p>
          </div>
        </div>

        {/* Risks Alerts */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
          <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" />
            RISK ASSESSMENT
          </span>
          <ul className="text-xs space-y-1.5 text-gray-400">
            {(blueprint.risks || []).map((risk: string, i: number) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-rose-500 shrink-0 mt-0.5">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-3">
          <span className="text-[10px] font-mono text-primary font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            CO-FOUNDER CRITICAL ACTIONS
          </span>
          <ul className="text-xs space-y-1.5 text-gray-400">
            {(blueprint.recommendations || []).map((rec: string, i: number) => (
              <li key={i} className="flex gap-2 items-start">
                <span className="text-primary shrink-0 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
