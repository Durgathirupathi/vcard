'use client';

import React from 'react';
import { User, Mail } from 'lucide-react';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function TeamMembers() {
  const members = [
    { name: 'Karthik Rao', role: 'Founder & Product Architect', initial: 'K', linkedin: '#' },
    { name: 'Sarah Jenkins', role: 'Head of Engineering & UX Lead', initial: 'S', linkedin: '#' },
    { name: 'Deepika Sen', role: 'Brand & Corporate Relationships', initial: 'D', linkedin: '#' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Team Members</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Our Leadership Team</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {members.map((m, idx) => (
          <div 
            key={idx}
            className="p-6 bg-white border border-brown-200 rounded-3xl text-center space-y-4 shadow-sm hover:border-brown-300 hover:scale-[1.01] transition-all group"
          >
            {/* Mock Profile Avatar */}
            <div className="w-16 h-16 rounded-full bg-brown-50 border border-brown-200 text-brown-755 font-black text-xl flex items-center justify-center mx-auto shadow-inner group-hover:scale-105 transition-transform">
              {m.initial}
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-bold text-stone-900">{m.name}</h3>
              <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest block">{m.role}</span>
            </div>

            <div className="flex justify-center gap-3 pt-3 border-t border-brown-100/50 mt-4">
              <a 
                href={m.linkedin}
                className="p-1.5 bg-stone-50 hover:bg-brown-50 border border-brown-200 text-stone-500 hover:text-brown-755 rounded-lg transition-colors"
                title="LinkedIn Profile"
              >
                <LinkedinIcon />
              </a>
              <a 
                href="mailto:team@vcard.studio"
                className="p-1.5 bg-stone-50 hover:bg-brown-50 border border-brown-200 text-stone-500 hover:text-brown-755 rounded-lg transition-colors"
                title="Direct Corporate Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
