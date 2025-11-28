import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-[100dvh] w-full bg-slate-900 flex flex-col overflow-hidden">
      {/* 
         Native Layout Wrapper
         - h-[100dvh]: Forces full viewport height (dynamic viewport height).
         - safe-top/safe-bottom: Handled by CSS in index.html for notches/home bars.
      */}
      <main className="flex-1 flex flex-col relative w-full h-full safe-top safe-bottom overflow-hidden">
          {children}
      </main>
    </div>
  );
};