'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutGrid, Sparkles } from 'lucide-react';

export default function RecentBusinesses() {
  const [loading, setLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const dummyBusinesses = [
    { name: 'Apex Design Studio', slug: 'apex-design', category: 'Creative Agency', initial: 'A' },
    { name: 'Mahalakshmi Stores', slug: 'mahalakshmi', category: 'Retail Store', initial: 'M' },
    { name: 'Dr. Sarah Jenkins', slug: 'dr-sarah', category: 'Medical Consultant', initial: 'S' },
    { name: 'Heritage Realtors', slug: 'heritage', category: 'Real Estate', initial: 'H' },
  ];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="text-left">
          <span className="text-xs font-black uppercase tracking-widest text-brown-700">Live Platform Directory</span>
          <h2 className="text-2xl font-extrabold text-stone-900 font-display mt-1">Recently Added Profiles</h2>
        </div>
        <Link 
          href="/login" 
          className="text-xs font-black text-brown-700 hover:text-brown-755 flex items-center gap-1 group self-start"
        >
          Explore Complete Directory
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" aria-label="Loading directory...">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="p-6 bg-white border border-brown-100 rounded-2xl space-y-4 animate-pulse">
              <div className="w-12 h-12 bg-stone-150 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-stone-150 rounded w-3/4"></div>
                <div className="h-3 bg-stone-150 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-stone-150 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      ) : dummyBusinesses.length === 0 ? (
        // Empty State
        <div className="p-12 text-center bg-white border border-brown-250 rounded-3xl text-stone-500 font-medium text-xs">
          No recently added businesses found.
        </div>
      ) : (
        // Grid Display
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dummyBusinesses.map((b, idx) => (
            <div 
              key={idx}
              className="p-6 bg-white border border-brown-200 hover:border-brown-300 rounded-2xl shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-all group"
            >
              <div className="space-y-4 text-left">
                <div className="w-12 h-12 rounded-full bg-brown-50 border border-brown-100 flex items-center justify-center font-black text-lg text-brown-755 shadow-inner">
                  {b.initial}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-brown-755 transition-colors">
                    {b.name}
                  </h3>
                  <span className="text-[10px] text-stone-400 font-black block mt-0.5 uppercase tracking-widest">
                    {b.category}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-brown-100/50 mt-5">
                <Link
                  href={`/login`}
                  className="w-full py-2 bg-stone-50 hover:bg-brown-50 border border-brown-200 text-stone-700 hover:text-brown-755 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
