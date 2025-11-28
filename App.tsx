import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputView } from './components/InputView';
import { OptionsView } from './components/OptionsView';
import { AnalysisResult } from './components/AnalysisResult';
import { AppState, AnalysisResult as IAnalysisResult } from './types';
import { analyzeDecision } from './services/geminiService';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.INPUT);
  const [dilemma, setDilemma] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [result, setResult] = useState<IAnalysisResult | null>(null);

  const handleDilemmaSubmit = (text: string) => {
    setDilemma(text);
    setAppState(AppState.OPTIONS);
  };

  const handleOptionsSubmit = async (finalOptions: string[]) => {
    setOptions(finalOptions);
    setAppState(AppState.ANALYZING);
    
    // Trigger AI
    const analysis = await analyzeDecision(dilemma, finalOptions);
    
    if (analysis) {
        setResult(analysis);
        setAppState(AppState.RESULT);
    } else {
        // Handle error gracefully - go back to options
        alert("Sorry, I couldn't process that decision. Please try again.");
        setAppState(AppState.OPTIONS);
    }
  };

  const handleReset = () => {
    setDilemma('');
    setOptions([]);
    setResult(null);
    setAppState(AppState.INPUT);
  };

  return (
    <Layout>
      {appState === AppState.INPUT && (
        <InputView onNext={handleDilemmaSubmit} initialValue={dilemma} />
      )}
      
      {appState === AppState.OPTIONS && (
        <OptionsView 
            dilemma={dilemma} 
            onNext={handleOptionsSubmit}
            onBack={() => setAppState(AppState.INPUT)} 
        />
      )}

      {appState === AppState.ANALYZING && (
        <div className="flex flex-col items-center justify-center h-full space-y-6 p-8 text-center animate-in fade-in duration-500">
             <div className="relative">
                 <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 animate-pulse rounded-full"></div>
                 <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
             </div>
             <div>
                <h3 className="text-2xl font-bold text-white mb-2">Crunching Numbers</h3>
                <p className="text-slate-400">
                    Consulting decision matrices, analyzing trade-offs, and predicting outcomes for <span className="text-indigo-300">"{dilemma}"</span>...
                </p>
             </div>
        </div>
      )}

      {appState === AppState.RESULT && result && (
        <AnalysisResult result={result} onReset={handleReset} />
      )}
    </Layout>
  );
}