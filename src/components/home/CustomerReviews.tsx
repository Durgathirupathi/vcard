'use client';

import React from 'react';
import { Star, Sparkles, Quote } from 'lucide-react';

export default function CustomerReviews() {
  const reviews = [
    {
      name: 'Ramesh Krishnan',
      role: 'Insurance Broker Manager',
      text: 'VCard Studio replaced our traditional paper business cards completely. Clients love the easy Save Contact download.',
      rating: 5
    },
    {
      name: 'Deepika Sen',
      role: 'Retail Boutique Owner',
      text: 'The Store Template is fantastic. The direct WhatsApp query checkout feature helped us double our local organic inquiries.',
      rating: 5
    },
    {
      name: 'Dr. Amit Patel',
      role: 'Consulting Cardiologist',
      text: 'Extremely professional, high-contrast visual display. Helps me share my clinical location coordinates with patients instantly.',
      rating: 5
    }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Client Commendations</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Customer Testimonials</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r, idx) => (
          <div 
            key={idx}
            className="p-6 bg-white border border-brown-200 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:border-brown-300 transition-all text-left group"
          >
            <Quote className="w-8 h-8 text-brown-100 absolute top-4 right-4" />
            <div className="space-y-4 relative z-10">
              {/* Star rating display */}
              <div className="flex items-center gap-0.5">
                {[...Array(r.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-brown-500 text-brown-500" />
                ))}
              </div>

              <p className="text-stone-600 text-xs italic leading-relaxed font-medium">
                &ldquo;{r.text}&rdquo;
              </p>
            </div>

            <div className="pt-5 border-t border-brown-100 mt-6 relative z-10">
              <span className="block text-xs font-black text-stone-900 font-display">{r.name}</span>
              <span className="block text-[10px] text-stone-400 font-bold mt-0.5 uppercase tracking-wider">{r.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
