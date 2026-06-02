'use client';

import React from 'react';
import { CreditCard, ShieldCheck, Eye, Mail, TrendingUp } from 'lucide-react';

export default function CardsCounter() {
  const metrics = [
    { label: 'Total Cards Created', value: '12,840+', icon: CreditCard, color: 'text-brown-700 bg-brown-50 border-brown-100' },
    { label: 'Active Businesses', value: '9,450+', icon: ShieldCheck, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
    { label: 'Total Page Visitors', value: '1.2M+', icon: Eye, color: 'text-stone-700 bg-stone-100 border-stone-200' },
    { label: 'Leads Generated', value: '45,210+', icon: Mail, color: 'text-brown-500 bg-brown-50 border-brown-100' },
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12" aria-labelledby="metrics-heading">
      <h2 id="metrics-heading" className="sr-only">Platform Metrics Counter</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-brown-100 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest text-left">
                  {m.label}
                </span>
                <div className={`p-2.5 rounded-xl border ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex flex-col items-start">
                <span className="text-3xl font-black tracking-tight text-stone-900 font-display">
                  {m.value}
                </span>
                <div className="mt-2 text-[9px] text-stone-500 font-extrabold flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  +12.4% this month
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
