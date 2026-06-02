'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Home, ArrowRight, ShieldQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between overflow-x-hidden selection:bg-brown-200/50 selection:text-brown-900">
      
      {/* Background Subtle Stripe Dot Grid */}
      <div className="absolute inset-0 grid-accent opacity-30 pointer-events-none z-0"></div>

      {/* Navigation Header - Matching main nav */}
      <nav className="sticky top-0 z-50 w-full glass-panel border-b border-brown-100/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-brown-100 border border-brown-200 rounded-xl text-brown-700 shadow-inner">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-brown-900 font-display">
              VCard Studio
            </span>
          </div>
          <div>
            <Link 
              href="/" 
              id="nav-back-home"
              className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brown-755 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* 404 Central Card - Apple-polished Corporate Layout */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full bg-white border border-brown-200 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-8 relative overflow-hidden animate-fadeIn">
          
          <div className="mx-auto p-4 bg-brown-50 border border-brown-100 text-brown-755 rounded-2xl w-fit shadow-inner animate-float">
            <ShieldQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-brown-755 px-3 py-1 bg-brown-100 border border-brown-200 rounded-full">
              Error 404
            </span>
            <h1 className="text-4xl font-black tracking-tight text-stone-900 font-display mt-2">
              Page Not Found
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
              The requested digital business profile page does not exist or has been moved by the administrator.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link
              href="/"
              id="btn-return-home"
              className="w-full px-6 py-3.5 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01]"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>
            <Link
              href="/contact"
              id="btn-report-issue"
              className="w-full px-6 py-3.5 bg-white hover:bg-stone-50 border border-brown-200 text-stone-700 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01]"
            >
              Support Inquiry
              <ArrowRight className="w-4 h-4 text-stone-500" />
            </Link>
          </div>
        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="w-full bg-white border-t border-brown-100 py-8 text-center relative z-10">
        <div className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">
          © VCard Studio. Premium Identity Systems.
        </div>
      </footer>
    </div>
  );
}
