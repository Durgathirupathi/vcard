'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function AboutTestimonials() {
  const testimonials = [
    { name: 'Karthik Subbaraj', company: 'Cinema Studio Director', text: 'Sharing crew coordinates via VCard Studio has optimized our production scheduling logistics immensely.' },
    { name: 'Meera Jasmine', company: 'Organic Silk Exporter', text: 'Beautiful layout designs that feel Apple-level. Instantly established luxury authority with foreign accounts.' }
  ];

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Corporate Endorsements</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Client Reviews</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {testimonials.map((t, idx) => (
          <div 
            key={idx}
            className="p-6 bg-white border border-brown-200 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:border-brown-300 transition-all group"
          >
            <Quote className="w-8 h-8 text-brown-100 absolute top-4 right-4" />
            <div className="space-y-3.5 relative z-10">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brown-500 text-brown-500" />
                ))}
              </div>
              <p className="text-stone-600 text-xs italic leading-relaxed font-medium">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>

            <div className="pt-5 border-t border-brown-100 mt-6 relative z-10">
              <span className="block text-xs font-black text-stone-900 font-display">{t.name}</span>
              <span className="block text-[10px] text-stone-400 font-bold mt-0.5 uppercase tracking-wider">{t.company}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
