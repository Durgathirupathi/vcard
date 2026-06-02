'use client';

import React from 'react';
import { CreditCard, Users, Mail, Clock } from 'lucide-react';

export default function AboutStats() {
  const stats = [
    { label: 'Businesses Created', value: '15,000+', icon: CreditCard, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { label: 'Active Users', value: '9,800+', icon: Users, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' },
    { label: 'Leads Generated', value: '50K+', icon: Mail, color: 'text-yellow-800 bg-yellow-50 border-yellow-250' },
    { label: 'Years of Experience', value: '6+ Years', icon: Clock, color: 'text-stone-700 bg-stone-100 border-stone-250' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-8" aria-label="Company Statistics">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-brown-100 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-all text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">
                  {s.label}
                </span>
                <div className={`p-2 rounded-lg border ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
                  {s.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
