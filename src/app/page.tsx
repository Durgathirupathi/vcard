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
  Compass 
} from 'lucide-react';

export default function LandingPage() {
  const highlights = [
    { title: 'Niche Visual Templates', desc: '5 distinct responsive themes tailored for consulting, tech, designer portfolios, stores, and luxury brands.', icon: Layers },
    { title: 'Dynamic VCF Generator', desc: 'Allow visitors to download comprehensive VCF contact cards straight to iOS and Android native lists.', icon: Smartphone },
    { title: 'Integrated Analytics', desc: 'Track precise metrics on card page views, phone calls, WhatsApp clickouts, and lead submissions.', icon: Zap },
    { title: 'Secure Admin Panels', desc: 'Complete administrative controls for profile management and spreadsheet CSV database reports.', icon: ShieldCheck },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

      {/* Nav Header */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-200 via-indigo-100 to-purple-200 bg-clip-text text-transparent">
            VCard Studio
          </span>
        </div>

        <Link
          href="/login"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
        >
          Admin Console
          <Compass className="w-4 h-4 text-indigo-400" />
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-4xl mx-auto text-center px-6 pt-20 pb-16 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-bold text-indigo-400 uppercase tracking-widest animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          Digital Identity Suite
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
          Craft Elite Digital <br className="hidden sm:inline" /> Business Profiles
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Create premium, highly responsive, and fast-loading virtual identity cards designed for modern agencies, designers, consultants, saree stores, and luxury brands.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-950/40 hover:scale-[1.02] active:scale-100 transition-all flex items-center justify-center gap-2"
          >
            Launch Admin Suite
            <Send className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature Grids */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-4 hover:border-slate-750 transition-colors shadow-md flex flex-col justify-between"
              >
                <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-100">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-6 inset-x-0 z-10 text-center text-slate-600 text-[10px] uppercase font-bold tracking-widest">
        © VCard Studio. Premium Identity Systems.
      </footer>
    </div>
  );
}
