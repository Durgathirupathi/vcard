'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Send, 
  Smartphone, 
  Zap, 
  Info 
} from 'lucide-react';

export default function LandingPage() {
  const highlights = [
    { title: 'Niche Visual Templates', desc: '5 distinct responsive themes tailored for consulting, tech, designer portfolios, stores, and luxury brands.', icon: Layers },
    { title: 'Dynamic VCF Generator', desc: 'Allow visitors to download comprehensive VCF contact cards straight to iOS and Android native lists.', icon: Smartphone },
    { title: 'Integrated Analytics', desc: 'Track precise metrics on card page views, phone calls, WhatsApp clickouts, and lead submissions.', icon: Zap },
    { title: 'Secure Admin Panels', desc: 'Complete administrative controls for profile management and spreadsheet CSV database reports.', icon: ShieldCheck },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      
      {/* Navigation Header - Clean Corporate White Styling */}
      <nav className="relative z-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              VCard Studio
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950 transition-colors">
              Features
            </a>
            <Link href="/about" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-950 transition-colors flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              About Us
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Classic High-Readability Layout */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-24 pb-16 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-slate-650" />
          Digital Identity Suite
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-slate-950">
          Professional Digital <br className="hidden sm:inline" /> Business Profiles
        </h1>

        <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Create premium, highly responsive, and fast-loading virtual identity cards designed for modern agencies, designers, consultants, saree stores, and luxury brands.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/about"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            Learn About Us
            <Send className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 pb-24 scroll-mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 hover:border-slate-350 transition-colors shadow-sm flex flex-col justify-between"
              >
                <div className="p-3 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-950">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Clean Corporate Footer with Discreet Admin Link */}
      <footer className="w-full bg-white border-t border-slate-200 py-10 text-center">
        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">
          © VCard Studio. Premium Identity Systems. All Rights Reserved.
        </div>
        <div className="mt-3">
          <Link 
            href="/login" 
            className="text-[9px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors hover:underline"
          >
            Administrative Console Login
          </Link>
        </div>
      </footer>
    </div>
  );
}
