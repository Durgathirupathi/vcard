'use client';

import React from 'react';
import { CheckCircle, Sparkles, Zap, ShieldAlert, Award } from 'lucide-react';

export default function WhyChooseUs() {
  const advantages = [
    { title: 'Stripe-Inspired Designs', desc: 'No generic, clunky landing page builders. Get Apple-polished corporate layouts built to look premium.' },
    { title: 'Real-time VCF Contacts', desc: 'Our standardized metadata encoding auto-saves to mobile address books flawlessly.' },
    { title: 'Zero Emojis Nav System', desc: 'Strict professional guidelines for core navigations to build luxury brand authority.' },
    { title: 'Secure Client-Isolation', desc: 'Complete administrative privacy shielding leads, traffic metrics, and CSV reporting.' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-10 shadow-lg text-left">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          
          <div className="lg:col-span-2 space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-brown-700">Competitive Edge</span>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 font-display">
              Why Professionals Choose VCard Studio
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
              We focus strictly on high-performance, structured micro-business catalogs and direct networking pipelines.
            </p>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {advantages.map((ad, idx) => (
              <div key={idx} className="space-y-2 border-l-2 border-brown-100 pl-4 text-left">
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{ad.title}</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                  {ad.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
