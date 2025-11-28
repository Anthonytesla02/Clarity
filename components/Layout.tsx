import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-0 sm:p-4">
      {/* Mobile Frame Simulation on Desktop, Fullscreen on Mobile */}
      <div className="w-full h-[100dvh] sm:h-[850px] sm:max-w-[400px] bg-slate-900 sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative border-0 sm:border-8 border-slate-800 ring-1 ring-white/10">
        
        {/* Status Bar simulation (only visual for desktop feel) */}
        <div className="hidden sm:flex justify-between items-center px-6 py-3 text-slate-400 text-xs font-medium z-50 absolute top-0 w-full bg-slate-900/80 backdrop-blur-md rounded-t-[2rem]">
            <span>9:41</span>
            <div className="flex gap-1.5">
                <div className="w-4 h-4 rounded-full border border-current"></div>
                <div className="w-4 h-4 rounded-full border border-current"></div>
                <div className="w-6 h-4 rounded-md border border-current bg-current"></div>
            </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative pt-0 sm:pt-8">
            {children}
        </main>
      </div>
    </div>
  );
};