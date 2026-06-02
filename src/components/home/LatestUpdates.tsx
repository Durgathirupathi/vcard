'use client';

import React from 'react';
import { Bell, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LatestUpdates() {
  const updates = [
    { tag: 'New Template', title: 'Hermes-Inspired Luxury Layout Launched', date: 'June 2026', desc: 'Premium Template 5 is now live for luxury real estate and concierge business categories.' },
    { tag: 'Feature Upgrade', title: 'Unified VCF Address Book Auto-Saves', date: 'May 2026', desc: 'Updated contact generation pipeline to support multiple telephone tags and absolute address markers.' },
    { tag: 'Optimized Speed', title: 'Next.js 15 Static Pre-rendering Tuning', date: 'April 2026', desc: 'Reduced First Load JS by 30% to achieve lightning-fast loading speeds on mobile networks.' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Platform Releases</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Latest Updates & Features</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {updates.map((up, idx) => (
          <div 
            key={idx}
            className="p-6 bg-white border border-brown-200 rounded-3xl flex flex-col justify-between shadow-sm hover:border-brown-300 transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-brown-50 text-brown-755 border border-brown-200 rounded-md">
                  {up.tag}
                </span>
                <span className="text-[10px] text-stone-400 font-bold">{up.date}</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider leading-relaxed group-hover:text-brown-755 transition-colors">
                  {up.title}
                </h3>
                <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                  {up.desc}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-brown-100/50 mt-5">
              <Link 
                href="/login" 
                className="text-[10px] font-black text-brown-700 hover:text-brown-755 flex items-center gap-0.5 group/link"
              >
                Read Full Release
                <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
