'use client';

import React from 'react';
import { Zap, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export default function CoreValues() {
  const values = [
    { title: 'Absolute Reliability', desc: 'Guaranteed platform uptimes and lighting fast loading speeds on every mobile device.', icon: Zap, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { title: 'Privacy Integrity', desc: 'Secure Firestore schemas safeguarding customer metrics and lead databases.', icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' },
    { title: 'Design Integrity', desc: 'Stripe-inspired layouts, micro-animations, and balanced typography.', icon: Award, color: 'text-yellow-800 bg-yellow-50 border-yellow-250' },
    { title: 'Client Centered support', desc: 'Bespoke corporate setups and onboarding assistance tailored for teams.', icon: HeartHandshake, color: 'text-stone-700 bg-stone-100 border-stone-250' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Corporate Anchors</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Our Core Values</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, idx) => {
          const Icon = v.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-brown-200 rounded-3xl flex flex-col justify-between shadow-sm hover:border-brown-300 hover:scale-[1.01] transition-all text-left group"
            >
              <div className="space-y-4">
                <div className={`p-2.5 rounded-xl border w-fit shadow-inner ${v.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{v.title}</h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    {v.desc}
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
