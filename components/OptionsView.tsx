import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Plus, X, Sparkles, ArrowRight } from 'lucide-react';
import { suggestOptions } from '../services/geminiService';

interface OptionsViewProps {
  dilemma: string;
  onNext: (options: string[]) => void;
  onBack: () => void;
}

export const OptionsView: React.FC<OptionsViewProps> = ({ dilemma, onNext, onBack }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  // Auto-suggest on mount if empty
  useEffect(() => {
    if (options.length === 0) {
      handleAutoSuggest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAutoSuggest = async () => {
    setIsSuggesting(true);
    const suggestions = await suggestOptions(dilemma);
    setOptions(prev => Array.from(new Set([...prev, ...suggestions])));
    setIsSuggesting(false);
  };

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (options.length >= 2) {
      onNext(options);
    }
  };

  return (
    <div className="flex flex-col h-full p-6 max-w-md mx-auto animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="!px-2">Back</Button>
        <div className="text-slate-400 text-sm font-medium">Step 2 of 3</div>
      </div>

      <h2 className="text-2xl font-bold mb-2">Define your options</h2>
      <p className="text-slate-400 text-sm mb-6 line-clamp-2">
        "{dilemma}"
      </p>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 -mx-2 px-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700/50 group">
            <span className="font-medium text-slate-200">{opt}</span>
            <button 
              onClick={() => removeOption(idx)}
              className="text-slate-500 hover:text-red-400 p-1"
            >
              <X size={18} />
            </button>
          </div>
        ))}
        
        {options.length === 0 && !isSuggesting && (
           <div className="text-center py-10 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
              No options added yet.
           </div>
        )}

        {isSuggesting && (
             <div className="flex items-center justify-center py-8 space-x-2 text-indigo-400 animate-pulse">
                <Sparkles size={18} />
                <span>AI is brainstorming...</span>
             </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addOption()}
            placeholder="Add an option manually..."
            className="flex-1 bg-slate-800 border-none rounded-xl px-4 text-white focus:ring-2 focus:ring-indigo-500/50"
          />
          <button 
            onClick={addOption}
            disabled={!newOption.trim()}
            className="bg-slate-700 text-white p-3.5 rounded-xl disabled:opacity-50"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <Button 
                variant="secondary" 
                onClick={handleAutoSuggest} 
                disabled={isSuggesting}
                className="text-xs"
              >
               <Sparkles size={14} className="mr-2" />
               Suggest More
             </Button>
             
             <Button 
                variant="primary" 
                onClick={handleNext} 
                disabled={options.length < 2}
                className="text-xs"
             >
               Analyze <ArrowRight size={14} className="ml-2" />
             </Button>
        </div>
      </div>
    </div>
  );
};