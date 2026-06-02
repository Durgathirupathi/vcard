'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-stone-50/80 backdrop-blur-sm text-stone-800 font-sans z-50 animate-fadeIn">
      <div className="flex flex-col items-center gap-4 p-6 bg-white border border-brown-200 rounded-2xl shadow-xl max-w-xs mx-auto">
        <div className="p-4 bg-brown-50 border border-brown-100 rounded-2xl text-brown-755 shadow-inner animate-spin">
          <Sparkles className="w-8 h-8" />
        </div>
        <span className="text-xs font-black text-brown-900 uppercase tracking-widest animate-pulse">
          Loading Page...
        </span>
      </div>
    </div>
  );
}

