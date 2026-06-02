'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';

export default function HomeFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do customers save my contact card to their phones?',
      a: 'Each profile card features a high-contrast "Save Contact" button. When visitors tap it, it generates a standard VCF address book file which instantly prompts them to save all your details directly to their phone contact lists.'
    },
    {
      q: 'Can I link my social handles and products?',
      a: 'Yes, absolutely. Our admin dashboard allows you to link all major social media platforms (Facebook, Instagram, LinkedIn, YouTube) and design service catalogs or product cards with WhatsApp direct query integration.'
    },
    {
      q: 'Do these profiles work on mobile devices?',
      a: 'Yes. Every template in the catalog is engineered from the ground up for absolute responsive mobile alignment, optimized for one-touch direct phone calls, emails, and address book downloads.'
    },
    {
      q: 'Can I track metrics on visitors and leads?',
      a: 'Yes. Our platform monitors page-view analytics and tracks total WhatsApp clickouts, direct phone call attempts, and lead capture submissions, displayed in your administrative workspace.'
    }
  ];

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Platform Answers</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="bg-white border border-brown-200 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-stone-900 hover:text-brown-755 transition-colors gap-4"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-display flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-brown-755 flex-shrink-0" />
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-stone-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-6 pb-5 border-t border-brown-100/50 pt-4 text-left">
                  <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
