import React from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { GeminiStatus } from '../types';
import ReactMarkdown from 'react-markdown'; // Assuming we can use simple rendering or just plain text mapping, but standard requirement says no extra libs unless common. I'll stick to basic formatting to avoid missing deps issues if not standard.

// Since I cannot install react-markdown in this simulated env easily without guaranteeing it's there, 
// I will build a simple markdown-like parser or just render whitespace.

interface AnalysisPanelProps {
  status: GeminiStatus;
  result: string;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ status, result, onAnalyze, canAnalyze }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 backdrop-blur-lg rounded-xl p-6 text-white border border-white/10 shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif font-bold flex items-center gap-2">
          <Sparkles className="text-yellow-400 w-5 h-5" />
          AI Strategist
        </h2>
        {status !== 'loading' && (
          <button
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className={`
              px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${canAnalyze 
                ? 'bg-yellow-500 text-indigo-900 hover:bg-yellow-400 hover:scale-105 shadow-lg shadow-yellow-500/20' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            {result ? 'Re-Analyze' : 'Ask Expert'}
          </button>
        )}
      </div>

      <div className="flex-1 min-h-[200px] bg-black/20 rounded-lg p-4 overflow-y-auto border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
        {status === 'idle' && !result && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center opacity-70">
            <Sparkles className="w-12 h-12 mb-3 opacity-20" />
            <p>Assemble your hand and ask the AI for strategic advice.</p>
          </div>
        )}

        {status === 'loading' && (
          <div className="h-full flex flex-col items-center justify-center text-yellow-200">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="animate-pulse text-sm">Consulting the masters...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="h-full flex flex-col items-center justify-center text-red-300">
            <AlertCircle className="w-8 h-8 mb-2" />
            <p>Connection to AI failed.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="prose prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-line">
            {result}
          </div>
        )}
      </div>
    </div>
  );
};
