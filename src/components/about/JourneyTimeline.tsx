'use client';

import React from 'react';
import { Calendar, Award, Rocket, CheckCircle } from 'lucide-react';

export default function JourneyTimeline() {
  const milestones = [
    { year: '2026', title: 'Platform Launch', desc: 'VCard Studio is launched globally supporting multi-tenant digital profiles and real-time vCard exports.', icon: Rocket, color: 'text-brown-700 bg-brown-50 border-brown-200' },
    { year: '2027', title: 'NFC Integration Suite', desc: 'Introduced direct NFC hardware cloning interfaces, letting owners link card profiles to physical chips.', icon: CheckCircle, color: 'text-emerald-700 bg-emerald-50 border-emerald-250' },
    { year: '2028', title: 'Global Enterprise Expansion', desc: 'Partnered with international finance firms and insurance aggregators to support 15K+ active profiles.', icon: Award, color: 'text-yellow-800 bg-yellow-50 border-yellow-250' }
  ];

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Company History</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Our Journey & Milestones</h2>
      </div>

      <div className="relative border-l-2 border-brown-200 ml-4 md:ml-32 space-y-8 text-left">
        {milestones.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="relative pl-8 md:pl-10 group">
              {/* Year badge absolute left for desktop */}
              <div className="hidden md:block absolute -left-32 top-1 text-right w-24">
                <span className="text-sm font-black text-brown-755 font-display">{m.year}</span>
              </div>

              {/* Circle marker on timeline */}
              <span className="absolute -left-3.5 top-1.5 p-1 bg-white border-2 border-brown-300 rounded-full group-hover:border-brown-700 transition-colors">
                <Icon className="w-3.5 h-3.5 text-brown-755" />
              </span>

              <div className="space-y-1 bg-white border border-brown-100 p-5 rounded-2xl shadow-sm hover:border-brown-300 transition-colors">
                <span className="md:hidden block text-xs font-black text-brown-755 font-display mb-1">{m.year}</span>
                <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{m.title}</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed font-medium pt-1">
                  {m.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
