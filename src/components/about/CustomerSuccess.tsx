'use client';

import React from 'react';
import { Sparkles, Star, TrendingUp } from 'lucide-react';

export default function CustomerSuccess() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-10 shadow-lg text-left relative overflow-hidden">
        
        {/* Subtle grid backing */}
        <div className="absolute inset-0 grid-accent opacity-15 pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-md">
            <span className="text-xs font-black uppercase tracking-widest text-brown-700">Conversion Success</span>
            <h2 className="text-2xl font-extrabold text-stone-900 font-display leading-tight">
              Empowering Over 98% Success Ratio
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
              We monitor contact interactions continuously. Our profiles generate 3x higher visitor engagements compared to standard corporate websites.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full md:w-auto flex-shrink-0">
            <div className="p-4 bg-stone-50 border border-brown-100 rounded-2xl text-center shadow-inner">
              <span className="block text-xl font-black text-brown-755 font-display">4.9 / 5</span>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1 block">Rating Average</span>
            </div>
            <div className="p-4 bg-stone-50 border border-brown-100 rounded-2xl text-center shadow-inner">
              <span className="block text-xl font-black text-brown-755 font-display">99.9%</span>
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-1 block">Platform Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
