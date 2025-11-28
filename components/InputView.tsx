import React, { useState } from 'react';
import { Button } from './Button';
import { BrainCircuit } from 'lucide-react';

interface InputViewProps {
  onNext: (dilemma: string) => void;
  initialValue?: string;
}

export const InputView: React.FC<InputViewProps> = ({ onNext, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onNext(value);
  };

  return (
    <div className="flex flex-col h-full p-6 animate-in fade-in zoom-in duration-300">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
          <BrainCircuit className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
          What's on your mind?
        </h2>
        <p className="text-slate-400 max-w-xs mx-auto">
          Describe the difficult decision you need to make. The AI will help you split it down.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6 mb-8">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. Should I quit my job to start a bakery, or stay for the promotion?"
          className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
          autoFocus
        />
        <Button 
          type="submit" 
          fullWidth 
          disabled={!value.trim()}
        >
          Start Analysis
        </Button>
      </form>
    </div>
  );
};