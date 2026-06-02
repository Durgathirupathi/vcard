'use client';

import React from 'react';
import { ShieldCheck, Home, Store, HeartPulse, Briefcase, Utensils, Compass } from 'lucide-react';

export default function NicheCategories() {
  const categories = [
    { name: 'Insurance & Claims', desc: 'Secure profile lists designed specifically for insurance brokers.', icon: ShieldCheck, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { name: 'Real Estate Brokers', desc: 'Sleek luxury margins designed for high-end home catalogs.', icon: Home, color: 'text-stone-700 bg-stone-100 border-stone-250' },
    { name: 'Retail Store & Boutiques', desc: 'Product grid showcases tailored for local retail checkout pipelines.', icon: Store, color: 'text-brown-500 bg-brown-50 border-brown-200' },
    { name: 'Medical Specialists', desc: 'Clinical location coordinates and direct native calling systems.', icon: HeartPulse, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Service Coverage</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Directory Niche Scopes</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {categories.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-brown-200 rounded-3xl flex flex-col justify-between shadow-sm hover:border-brown-300 hover:scale-[1.01] transition-all group"
            >
              <div className="space-y-4">
                <div className={`p-2.5 rounded-xl border w-fit shadow-inner ${c.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{c.name}</h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    {c.desc}
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
