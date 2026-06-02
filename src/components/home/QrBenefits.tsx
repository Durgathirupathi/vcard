'use client';

import React from 'react';
import { Smartphone, Sparkles, UserPlus, Zap, QrCode } from 'lucide-react';

export default function QrBenefits() {
  const benefits = [
    { title: 'Share Instantly', desc: 'Hold up your personalized QR code and let anyone scan to load your entire business profile in a flash.', icon: Zap, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { title: 'Save Contact Instantly', desc: 'Visitors can download a direct vCard file (.vcf) that auto-populates their native iOS or Android address books.', icon: UserPlus, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' },
    { title: 'Quick Dashboard Access', desc: 'Seamless administrative entry to card metrics, lead registries, and image uploads via scanning dynamic markers.', icon: Sparkles, color: 'text-yellow-800 bg-yellow-50 border-yellow-250' },
    { title: 'Mobile-First Layouts', desc: 'All virtual business profiles are specifically designed for fluid responsive touch controls on mobile viewports.', icon: Smartphone, color: 'text-stone-700 bg-stone-100 border-stone-250' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* Left Column: Visual QR graphic */}
        <div className="lg:col-span-2 bg-white border border-brown-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center shadow-md min-h-[300px]">
          <div className="p-5 bg-brown-50 border border-brown-100 rounded-2xl text-brown-755 shadow-inner animate-pulse mb-6">
            <QrCode className="w-16 h-16" />
          </div>
          <h3 className="text-lg font-black text-stone-900 font-display">Dynamic QR Matrix</h3>
          <p className="text-xs text-stone-500 max-w-xs mt-2 leading-relaxed font-medium">
            Scan to share profiles instantly without typing URLs. Eco-friendly and extremely high-performance.
          </p>
        </div>

        {/* Right Column: Benefits list */}
        <div className="lg:col-span-3 space-y-6">
          <div className="text-left">
            <span className="text-xs font-black uppercase tracking-widest text-brown-700">Digital Portability</span>
            <h2 className="text-2xl font-extrabold text-stone-900 font-display mt-0.5">QR Code Ecosystem Benefits</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 bg-white border border-brown-100 rounded-2xl flex items-start gap-4 hover:border-brown-200 transition-colors text-left"
                >
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${b.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{b.title}</h3>
                    <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed font-medium">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
