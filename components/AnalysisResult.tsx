import React, { useState } from 'react';
import { AnalysisResult as IAnalysisResult } from '../types';
import { Button } from './Button';
import { Home, Share2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface AnalysisResultProps {
  result: IAnalysisResult;
  onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  // Prepare data for Radar Chart
  const radarData = result.factors.map(factor => {
    const dataPoint: any = { subject: factor.name, fullMark: 100 };
    result.overallScores.forEach(opt => {
        // Find score for this option and factor
        const scoreEntry = result.scores[factor.name]?.find(s => s.optionName === opt.optionName);
        dataPoint[opt.optionName] = scoreEntry ? scoreEntry.score : 0;
    });
    return dataPoint;
  });

  // Prepare colors for chart
  const colors = ["#818cf8", "#34d399", "#f472b6", "#fbbf24"];

  const toggleFactor = (name: string) => {
    setExpandedFactor(expandedFactor === name ? null : name);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-y-auto animate-in fade-in duration-500">
      
      {/* Header / Winner Banner */}
      <div className="relative bg-gradient-to-b from-indigo-900 to-slate-900 p-8 pb-12 rounded-b-[3rem] shadow-2xl z-10">
        <div className="absolute top-4 right-4">
             <button onClick={onReset} className="p-2 bg-black/20 rounded-full text-slate-300 hover:text-white">
                 <Home size={20} />
             </button>
        </div>
        
        <div className="text-center space-y-2 mt-4">
          <span className="inline-block px-3 py-1 bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-widest rounded-full">
            Top Choice
          </span>
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">
            {result.winner}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
             <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-400" style={{ width: `${result.confidence}%` }}></div>
             </div>
             <span className="text-xs text-green-400 font-mono">{result.confidence}% Match</span>
          </div>
          <p className="text-slate-300 text-sm mt-4 leading-relaxed max-w-sm mx-auto">
            {result.summary}
          </p>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-20 space-y-6 pb-20">
        
        {/* Score Comparison Card */}
        <div className="bg-slate-800 rounded-2xl p-5 shadow-lg border border-slate-700/50">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 text-center">Trade-off Analysis</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        {result.overallScores.map((opt, i) => (
                            <Radar
                                key={opt.optionName}
                                name={opt.optionName}
                                dataKey={opt.optionName}
                                stroke={colors[i % colors.length]}
                                fill={colors[i % colors.length]}
                                fillOpacity={0.3}
                            />
                        ))}
                        <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Factors Breakdown */}
        <div className="space-y-3">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider px-2">Decision Factors</h3>
            {result.factors.map((factor, idx) => (
                <div key={idx} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50">
                    <button 
                        onClick={() => toggleFactor(factor.name)}
                        className="w-full flex items-center justify-between p-4 text-left"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="font-semibold text-slate-200">{factor.name}</span>
                                <span className="text-xs text-slate-500">Weight: {factor.weight}/10</span>
                            </div>
                        </div>
                        {expandedFactor === factor.name ? <ChevronUp size={18} className="text-slate-500"/> : <ChevronDown size={18} className="text-slate-500"/>}
                    </button>
                    
                    {expandedFactor === factor.name && (
                        <div className="bg-slate-800/50 p-4 border-t border-slate-700 space-y-3 animate-in slide-in-from-top-2 duration-200">
                             <p className="text-xs text-slate-400 italic mb-2">{factor.description}</p>
                             {result.scores[factor.name]?.map((score, sIdx) => (
                                 <div key={sIdx} className="space-y-1">
                                     <div className="flex justify-between text-sm">
                                         <span className="text-slate-300">{score.optionName}</span>
                                         <span className={`font-mono ${score.score >= 80 ? 'text-green-400' : score.score < 50 ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {score.score}/100
                                         </span>
                                     </div>
                                     <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${score.score >= 80 ? 'bg-green-500' : score.score < 50 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                                            style={{ width: `${score.score}%` }}
                                        ></div>
                                     </div>
                                     <p className="text-xs text-slate-500 mt-1">{score.reasoning}</p>
                                 </div>
                             ))}
                        </div>
                    )}
                </div>
            ))}
        </div>

        <div className="pt-4">
             <Button fullWidth onClick={onReset} variant="outline">Start New Decision</Button>
        </div>
      </div>
    </div>
  );
};