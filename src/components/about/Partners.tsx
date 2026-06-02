'use client';

import React from 'react';
import { Layers, Sparkles, LayoutGrid } from 'lucide-react';

export default function Partners() {
  const brands = [
    { name: 'Apex Logistics', sector: 'Transportation' },
    { name: 'Vanguard Advising', sector: 'Finance' },
    { name: 'Heritage Real Estate', sector: 'Property' },
    { name: 'Silk Organics Corp', sector: 'Retail' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Integrations Network</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Active Integration Partners</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {brands.map((b, idx) => (
          <div 
            key={idx}
            className="p-5 bg-white border border-brown-200 rounded-3xl flex flex-col justify-center items-center shadow-sm hover:border-brown-300 transition-colors"
          >
            <div className="p-2.5 bg-brown-50 border border-brown-100 rounded-2xl text-brown-755 shadow-inner mb-3">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="block text-xs font-black text-stone-900 uppercase tracking-wider">{b.name}</span>
            <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">{b.sector}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
