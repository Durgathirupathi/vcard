'use client';

import React from 'react';
import { Layers, Sparkles, Layout, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function BusinessShowcase() {
  const showcases = [
    { name: 'Karthik Rao Consultancy', category: 'Finance Advisor', template: 'Classic Professional Template', logo: 'K' },
    { name: 'Elite Realty Estates', category: 'Real Estate', template: 'Premium Luxury Template', logo: 'E' },
    { name: 'Mahalakshmi Silk Boutique', category: 'Retail Store', template: 'Store & Products Template', logo: 'M' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Digital Portfolio Gallery</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Client Showcase Panels</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {showcases.map((show, idx) => (
          <div 
            key={idx}
            className="p-6 bg-white border border-brown-200 rounded-3xl space-y-4 shadow-sm hover:border-brown-300 transition-colors flex flex-col justify-between hover:scale-[1.01] text-left group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-brown-100 pb-3">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{show.category}</span>
                <span className="text-[10px] text-brown-755 font-bold flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" />
                  Live Mobile View
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-brown-50 border border-brown-100 text-brown-755 flex items-center justify-center font-black text-lg">
                  {show.logo}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 truncate">{show.name}</h3>
                  <span className="text-[10px] text-stone-400 block mt-0.5">{show.template}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <Link 
                href="/login" 
                className="w-full py-2 bg-stone-50 group-hover:bg-brown-50 border border-brown-200 text-stone-700 group-hover:text-brown-755 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Launch Profile Preview
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
