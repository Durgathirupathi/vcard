'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function AboutFaq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do you offer corporate enterprise discounts?',
      a: 'Yes, we provide tiered pricing models for organizations looking to provision multiple digital profiles (e.g. 50+ business cards) with unified billing and administrative templates control.'
    },
    {
      q: 'Is my credentials database protected?',
      a: 'Absolutely. We enforce strict client-isolation security rules via Firebase Firestore database protocols, ensuring that lead logs and private user configurations remain hidden from other tenants.'
    },
    {
      q: 'Can I integrate custom domain name paths?',
      a: 'Yes. Enterprise accounts can request support configurations to host dynamic business profile cards under corporate subdomain URLs (e.g. card.yourcompany.com).'
    }
  ];

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">FAQ Center</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Corporate Help Accordions</h2>
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
