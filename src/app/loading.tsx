'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-slate-50/80 backdrop-blur-sm text-slate-800 font-sans z-50 animate-fadeIn">
      <div className="flex flex-col items-center gap-4 p-6 bg-white border border-slate-200 rounded-2xl shadow-xl max-w-xs mx-auto">
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-650 animate-spin">
          <Sparkles className="w-8 h-8" />
        </div>
        <span className="text-xs font-black text-slate-700 uppercase tracking-widest animate-pulse">
          Loading Page...
        </span>
      </div>
    </div>
  );
}
