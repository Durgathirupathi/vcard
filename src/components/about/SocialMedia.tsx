'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function SocialMedia() {
  const platforms = [
    { name: 'LinkedIn', icon: LinkedinIcon, color: 'text-stone-700 bg-stone-100 border-stone-250', handle: 'vcard-studio-inc' },
    { name: 'Instagram', icon: InstagramIcon, color: 'text-brown-500 bg-brown-50 border-brown-200', handle: '@vcard.studio' },
    { name: 'Facebook', icon: FacebookIcon, color: 'text-brown-700 bg-brown-50 border-brown-200', handle: 'vcardstudio' },
    { name: 'YouTube', icon: YoutubeIcon, color: 'text-rose-700 bg-rose-50 border-rose-100', handle: 'VCardStudioChannel' }
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Digital Communities</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Connect With Us</h2>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {platforms.map((p, idx) => {
          const Icon = p.icon;
          return (
            <a
              key={idx}
              href="#"
              className="px-5 py-4 bg-white border border-brown-200 hover:border-brown-550 rounded-2xl flex items-center gap-3 shadow-sm hover:scale-[1.01] hover:shadow-md transition-all text-left"
            >
              <div className={`p-2 rounded-lg border ${p.color}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="block text-xs font-black text-stone-900 uppercase tracking-wider">{p.name}</span>
                <span className="block text-[10px] text-stone-400 font-bold mt-0.5">{p.handle}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300 ml-1" />
            </a>
          );
        })}
      </div>
    </section>
  );
}
