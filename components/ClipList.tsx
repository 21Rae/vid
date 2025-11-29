import React from 'react';
import { Clip } from '../types';
import { Sparkles, Share2, MessageSquare, BarChart2 } from 'lucide-react';

interface ClipListProps {
  clips: Clip[];
  currentClipId?: string;
  onClipSelect: (clip: Clip) => void;
  onRepurpose: (clip: Clip) => void;
  isAnalyzing: boolean;
}

export const ClipList: React.FC<ClipListProps> = ({ 
  clips, 
  currentClipId, 
  onClipSelect, 
  onRepurpose,
  isAnalyzing
}) => {
  if (isAnalyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-lg font-medium text-slate-200">Analyzing Video Content...</h3>
        <p className="text-sm text-slate-500 mt-2">Identifying viral moments and generating captions.</p>
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <BarChart2 size={48} className="text-slate-700 mb-4" />
        <h3 className="text-lg font-medium text-slate-200">No Clips Generated Yet</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-xs">
          Click "Analyze Video" to let AI find the best moments for you.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      <div className="p-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 backdrop-blur-sm">
        <h2 className="font-semibold text-slate-200 flex items-center">
          <Sparkles className="w-4 h-4 text-indigo-400 mr-2" />
          AI Highlights ({clips.length})
        </h2>
      </div>
      
      <div className="space-y-2 p-3">
        {clips.map((clip) => {
          const isSelected = clip.id === currentClipId;
          return (
            <div 
              key={clip.id}
              onClick={() => onClipSelect(clip)}
              className={`
                group p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden
                ${isSelected 
                  ? 'bg-indigo-900/20 border-indigo-500/50 shadow-lg shadow-indigo-500/5' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }
              `}
            >
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
              )}
              
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-medium line-clamp-1 ${isSelected ? 'text-indigo-300' : 'text-slate-200'}`}>
                  {clip.title}
                </h3>
                <div className={`
                  px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase
                  ${clip.viralScore > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}
                `}>
                  Score: {clip.viralScore}
                </div>
              </div>
              
              <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                {clip.summary}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-500 font-mono bg-slate-950 px-1.5 py-0.5 rounded">
                  {Math.floor(clip.startTime/60)}:{(clip.startTime%60).toString().padStart(2,'0')} - {Math.floor(clip.endTime/60)}:{(clip.endTime%60).toString().padStart(2,'0')}
                </span>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRepurpose(clip);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950 transition-colors"
                  title="Generate Social Post"
                >
                  <Share2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
