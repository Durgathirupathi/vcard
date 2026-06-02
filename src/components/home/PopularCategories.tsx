'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Home, 
  Store, 
  HeartPulse, 
  Briefcase, 
  Utensils, 
  Compass,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function PopularCategories() {
  const categories = [
    { name: 'Insurance', count: '1,240 cards', icon: ShieldCheck, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { name: 'Real Estate', count: '3,110 cards', icon: Home, color: 'text-stone-700 bg-stone-100 border-stone-250' },
    { name: 'Retail Store', count: '4,520 cards', icon: Store, color: 'text-brown-500 bg-brown-50 border-brown-200' },
    { name: 'Doctor', count: '980 cards', icon: HeartPulse, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' },
    { name: 'Consultant', count: '2,840 cards', icon: Briefcase, color: 'text-yellow-800 bg-yellow-50 border-yellow-250' },
    { name: 'Restaurant', count: '1,450 cards', icon: Utensils, color: 'text-brown-755 bg-brown-100 border-brown-200' },
    { name: 'Freelancer', count: '2,310 cards', icon: Compass, color: 'text-stone-600 bg-stone-50 border-stone-200' },
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Explore Niches</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Popular Directory Categories</h2>
        <p className="text-xs text-stone-500 max-w-lg mx-auto font-medium">
          Quickly discover profiles tailored to specific industries and professions.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((c, idx) => {
          const Icon = c.icon;
          return (
            <Link
              key={idx}
              href="/login"
              className="px-5 py-4 bg-white border border-brown-200 hover:border-brown-500 rounded-2xl flex items-center gap-3.5 shadow-sm hover:scale-[1.01] hover:shadow-md transition-all text-left"
            >
              <div className={`p-2.5 rounded-xl border ${c.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{c.name}</h3>
                <span className="text-[10px] text-stone-400 font-bold block mt-0.5">{c.count}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300 ml-1" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
