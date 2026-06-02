'use client';

import React from 'react';
import { Eye, ShieldCheck } from 'lucide-react';

export default function VisionWidget() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-10 shadow-md text-left flex flex-col md:flex-row-reverse gap-8 items-center justify-between">
        
        {/* Graphic */}
        <div className="p-5 bg-brown-50 border border-brown-200 text-brown-700 rounded-2xl w-fit shadow-inner flex-shrink-0">
          <Eye className="w-10 h-10" />
        </div>

        {/* Text Details */}
        <div className="space-y-4 flex-1">
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-brown-50 text-brown-700 border border-brown-100 rounded-full">
            Long Term Target
          </span>
          <h2 className="text-xl font-extrabold text-stone-900 font-display">Our Vision</h2>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
            To define standard digital credentials globally, eliminating paper business card waste completely. We envision a world-class professional networking network where every local brand possesses a robust, secure, and instant visual profile.
          </p>
        </div>
      </div>
    </section>
  );
}
