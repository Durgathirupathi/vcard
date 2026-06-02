'use client';

import React from 'react';
import { Database, Layout, Terminal, Code, Cpu } from 'lucide-react';

export default function TechStack() {
  const technologies = [
    { name: 'Next.js 15', role: 'Server Render Engine', icon: Cpu, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { name: 'React 19', role: 'Reactive Architecture', icon: Code, color: 'text-stone-700 bg-stone-100 border-stone-250' },
    { name: 'Firebase', role: 'Database & Security Rules', icon: Database, color: 'text-yellow-800 bg-yellow-50 border-yellow-250' },
    { name: 'Tailwind CSS v4', role: 'Premium visual styling', icon: Layout, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Technology Stack</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Engineered on Modern Foundations</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {technologies.map((tech, idx) => {
          const Icon = tech.icon;
          return (
            <div 
              key={idx}
              className="p-5 bg-white border border-brown-200 rounded-3xl flex flex-col justify-between shadow-sm hover:border-brown-300 hover:scale-[1.01] transition-all text-left"
            >
              <div className="space-y-4">
                <div className={`p-2.5 rounded-xl border w-fit shadow-inner ${tech.color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{tech.name}</h3>
                  <span className="text-[10px] text-stone-400 font-bold block mt-0.5">{tech.role}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
