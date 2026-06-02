'use client';

import React from 'react';
import { Phone, Mail, MapPin, Share2 } from 'lucide-react';

export default function AboutContactInfo() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-8 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-brown-50 border border-brown-150 text-brown-755 rounded-xl shadow-inner flex-shrink-0">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-[9px] text-stone-400 font-black uppercase tracking-widest">Phone Direct</span>
              <a href="tel:+919876543210" className="text-xs font-bold text-stone-800 hover:text-brown-755 hover:underline">+91 (987) 654-3210</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-brown-50 border border-brown-150 text-brown-755 rounded-xl shadow-inner flex-shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-[9px] text-stone-400 font-black uppercase tracking-widest">Support Email</span>
              <a href="mailto:support@vcard.studio" className="text-xs font-bold text-stone-800 hover:text-brown-755 hover:underline">support@vcard.studio</a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-brown-50 border border-brown-150 text-brown-755 rounded-xl shadow-inner flex-shrink-0">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-[9px] text-stone-400 font-black uppercase tracking-widest">Corporate Headquarters</span>
              <span className="text-xs font-bold text-stone-800">Bangalore, Karnataka, India</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
