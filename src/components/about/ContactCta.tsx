'use client';

import React from 'react';
import { Send, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ContactCta() {
  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden">
        
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 grid-accent opacity-15 pointer-events-none z-0"></div>

        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brown-50 border border-brown-200 rounded-full text-[10px] font-black text-brown-700 uppercase tracking-widest shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            Corporate Engagement
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
            Looking for Custom Enterprise Alignments?
          </h2>

          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
            Contact our corporate architects to design isolated databases, subdomain routing, or custom template alignments for large-scale enterprise deployments.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
            >
              Get in Touch
              <Send className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-stone-50 hover:bg-brown-50 border border-brown-200 text-stone-700 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01]"
            >
              Return Home
              <ArrowRight className="w-4 h-4 text-stone-500" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
