'use client';

import React from 'react';
import { HelpCircle, ChevronRight, BookOpen, MessageSquare, Laptop } from 'lucide-react';
import Link from 'next/link';

export default function SupportHelp() {
  const supports = [
    { title: 'Onboarding Guide', desc: 'Read the full tutorial on styling templates.', icon: BookOpen, action: 'Tutorial Docs' },
    { title: 'NFC Cloning Walkthrough', desc: 'Learn how to write dynamic profile links.', icon: Laptop, action: 'NFC Guide' },
    { title: 'Direct Developer Support', desc: 'Submit query tickets for team setups.', icon: MessageSquare, action: 'Submit Ticket' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Help Desk Directory</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Help & Support Resources</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {supports.map((sup, idx) => {
          const Icon = sup.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-brown-200 rounded-3xl flex flex-col justify-between shadow-sm hover:border-brown-300 hover:scale-[1.01] transition-all group"
            >
              <div className="space-y-4">
                <div className="p-2.5 bg-brown-50 border border-brown-100 rounded-xl text-brown-755 w-fit shadow-inner">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-stone-900 uppercase tracking-wider">{sup.title}</h3>
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    {sup.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-brown-100 mt-5">
                <Link 
                  href="/login" 
                  className="text-[10px] font-black text-brown-700 hover:text-brown-755 flex items-center gap-0.5 group/link"
                >
                  {sup.action}
                  <ChevronRight className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
