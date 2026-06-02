'use client';

import React from 'react';
import { Target, CheckCircle } from 'lucide-react';

export default function MissionWidget() {
  const highlights = [
    'Strict multi-tenant security layers protecting leads.',
    'Instant standard-compliant VCF contact card generation.',
    'Optimized pre-rendered SEO performance for all screens.'
  ];

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-10 shadow-md text-left flex flex-col md:flex-row gap-8 items-center justify-between">
        
        {/* Graphic */}
        <div className="p-5 bg-emerald-50 border border-emerald-250 text-emerald-650 rounded-2xl w-fit shadow-inner flex-shrink-0">
          <Target className="w-10 h-10" />
        </div>

        {/* Text Details */}
        <div className="space-y-4 flex-1">
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
            Strategic Purpose
          </span>
          <h2 className="text-xl font-extrabold text-stone-900 font-display">Our Corporate Mission</h2>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
            To build secure, elegant, and highly accessible virtual identity workspaces that help business owners scale professional networks, manage contacts, and capture leads without paper boundaries.
          </p>

          <ul className="space-y-2 pt-2">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-stone-600 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
