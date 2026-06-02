'use client';

import React from 'react';
import { MapPin, Compass, Globe } from 'lucide-react';

export default function OfficeLocation() {
  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl overflow-hidden shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 items-stretch">
          
          {/* Mock Map Panel */}
          <div className="lg:col-span-3 min-h-[260px] bg-stone-100 flex items-center justify-center relative overflow-hidden group">
            {/* Dot Matrix map placeholder design */}
            <div className="absolute inset-0 grid-accent opacity-30 pointer-events-none z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="p-4 bg-brown-50 border border-brown-200 rounded-full text-brown-755 shadow-md animate-bounce">
                <MapPin className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest bg-white border border-brown-100 px-3 py-1 rounded-full shadow-sm">
                12.9716° N, 77.5946° E
              </span>
            </div>

            {/* Accent decorative border lines */}
            <div className="absolute bottom-4 left-4 p-2 bg-white/80 border border-brown-100/50 rounded-xl text-[9px] font-black uppercase text-stone-400">
              Bangalore CBD Office Map
            </div>
          </div>

          {/* Coordinates Details */}
          <div className="lg:col-span-2 p-6 sm:p-8 space-y-6 text-left flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-brown-700">Physical Coordinates</span>
              <h3 className="text-xl font-extrabold text-stone-900 font-display">Corporate Head Office</h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
                VCard Studio Tech Park, Ground Floor, Outer Ring Road, Bangalore, 560103, India.
              </p>
            </div>

            <div className="pt-4 border-t border-brown-100 space-y-2 text-xs text-stone-600 font-semibold">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-stone-400" />
                <span>NFC Device Logistics Center</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-stone-400" />
                <span>Global Support Desk Operations</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
