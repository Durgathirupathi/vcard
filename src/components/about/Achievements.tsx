'use client';

import React from 'react';
import { Award, ShieldAlert, Sparkles, Star } from 'lucide-react';

export default function Achievements() {
  const achievements = [
    { title: 'Best SaaS Architecture 2026', desc: 'Acclaimed for multi-tenant dynamic rendering schema isolation.', icon: Award, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { title: 'Eco-Friendly Carbon Award', desc: 'Eliminated 10M+ paper business cards, preserving substantial tree assets.', icon: Star, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' },
    { title: 'ISO 27001 Security Pre-audit', desc: 'Verified client-isolation frameworks protecting leads data databases.', icon: Sparkles, color: 'text-yellow-800 bg-yellow-50 border-yellow-250' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Accolades & Credits</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Corporate Achievements</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((ach, idx) => {
          const Icon = ach.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-brown-200 rounded-3xl flex flex-col justify-between shadow-sm hover:border-brown-300 hover:scale-[1.01] transition-all text-left group"
            >
              <div className="space-y-4">
                <div className={`p-2.5 rounded-xl border w-fit shadow-inner ${ach.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{ach.title}</h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    {ach.desc}
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
