'use client';

import React from 'react';
import { Target, TrendingUp, Share2, Award } from 'lucide-react';

export default function GrowthBenefits() {
  const points = [
    { title: 'Secure Lead Capture', desc: 'Direct, multi-tenant lead forms on your profile card let customers send query logs straight to your private spreadsheet CSV.', icon: Target, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { title: 'SEO Optimized Discoverability', desc: 'Pre-rendered high-performance index HTML structures make your card instantly visible on Google search results.', icon: TrendingUp, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' },
    { title: 'One-Click Sharing Pipelines', desc: 'Share your business credentials easily across LinkedIn, WhatsApp, email, or physical NFC scans in one click.', icon: Share2, color: 'text-yellow-800 bg-yellow-50 border-yellow-250' },
    { title: 'Premium Design Presence', desc: 'Give your business an Apple/Stripe-level polished profile that builds trust with luxury and enterprise clients.', icon: Award, color: 'text-stone-700 bg-stone-100 border-stone-250' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Digital Value Strategy</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Accelerate Your Business Growth</h2>
        <p className="text-xs text-stone-500 max-w-lg mx-auto font-medium">
          Ditch legacy paper cards for an advanced visual identity suite that actually converts visitors.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-brown-200 rounded-2xl flex flex-col justify-between shadow-sm hover:border-brown-300 hover:scale-[1.01] transition-all text-left"
            >
              <div className="space-y-4">
                <div className={`p-2.5 rounded-xl border w-fit shadow-inner ${p.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{p.title}</h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    {p.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
