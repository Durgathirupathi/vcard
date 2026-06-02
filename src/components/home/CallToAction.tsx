'use client';

import React from 'react';
import { ArrowRight, Sparkles, Send } from 'lucide-react';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-lg">
        
        {/* Decorative subtle stripe pattern overlay */}
        <div className="absolute inset-0 grid-accent opacity-20 pointer-events-none z-0"></div>

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brown-50 border border-brown-200 rounded-full text-[10px] font-black text-brown-700 uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            Instant Activation Suite
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-display">
            Ready to Build Your Premium Digital Presence?
          </h2>

          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
            Activate your digital profile card in minutes, configure high-conversion service grids, and start sharing coordinates seamlessly.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-brown-700 hover:bg-brown-755 text-white rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
            >
              Get Started Instantly
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-stone-50 hover:bg-brown-50 border border-brown-200 text-stone-700 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01]"
            >
              Support Inquiry
              <Send className="w-4 h-4 text-stone-500" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
