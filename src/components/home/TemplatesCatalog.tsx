'use client';

import React from 'react';
import { Layers, Sparkles, CheckCircle2, ChevronRight, Monitor, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TemplatesCatalog() {
  const templates = [
    { name: 'Classic Professional', suitability: 'Consultants & Advocates', desc: 'Direct corporate detailing prioritizing high accessibility and contact downloads.', color: 'border-brown-200 text-brown-700 bg-brown-50' },
    { name: 'Modern Corporate', suitability: 'Agencies & Tech Startups', desc: 'Sleek dark themes utilizing modular grid components and glowing border frames.', color: 'border-stone-250 text-stone-700 bg-stone-100' },
    { name: 'Portfolio Showcase', suitability: 'Designers & Artists', desc: 'Clean grayscale grids placing full focus on image galleries and visual portfolios.', color: 'border-amber-200 text-amber-700 bg-amber-50' },
    { name: 'Store & Products', suitability: 'Boutiques & Retail Stores', desc: 'Product grid arrays featuring custom price fields and instant WhatsApp ordering routes.', color: 'border-brown-200 text-brown-500 bg-brown-50' },
    { name: 'Premium Luxury', suitability: 'Luxury Real Estate Brokers', desc: 'Hermes-inspired sleek typography, generous padding, and minimalist layouts.', color: 'border-yellow-250 text-yellow-800 bg-yellow-50' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Polished Mockups</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Business Card Templates Catalog</h2>
        <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto font-medium">
          Choose from 5 distinct visual structures designed to reflect your unique industry profile.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl, idx) => (
          <div 
            key={idx}
            className="p-6 bg-white border border-brown-200 rounded-3xl space-y-5 flex flex-col justify-between hover:border-brown-300 shadow-sm hover:scale-[1.01] transition-all group text-left"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 bg-brown-50 border border-brown-100 rounded-md text-brown-755">
                  Template {idx + 1}
                </span>
                <span className="text-[10px] text-stone-400 font-bold flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5" />
                  Responsive
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-extrabold tracking-tight text-stone-900">{tpl.name}</h3>
                <p className="text-[11px] text-brown-755 font-bold uppercase tracking-wider">{tpl.suitability}</p>
                <p className="text-stone-500 text-xs leading-relaxed font-medium pt-1">
                  {tpl.desc}
                </p>
              </div>
            </div>

            <div className="pt-5 border-t border-brown-100 flex items-center justify-between">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wide">Ready to Deploy</span>
              <Link 
                href="/login" 
                className="text-xs font-black text-brown-700 hover:text-brown-755 flex items-center gap-0.5 group"
              >
                Launch
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
