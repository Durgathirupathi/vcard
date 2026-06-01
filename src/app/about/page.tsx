'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Target, Eye, Bookmark } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      {/* Primary Header Navigation */}
      <nav className="z-10 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-700">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-650">
              Back to Home
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-955 transition-colors">
              Contact Us
            </Link>
            <Link 
              href="/login" 
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl text-xs font-black shadow-sm transition-colors"
            >
              Login
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-650">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-900">
                VCard Studio
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-16 space-y-16">
        {/* Core Brand Introduction */}
        <section className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black text-indigo-700 uppercase tracking-widest">
            Corporate Profile
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            About VCard Studio
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            We are dedicated to building robust, accessible, and elegant virtual identity networks. Our software enables global enterprises and individual owners to share credentials with absolute ease.
          </p>
        </section>

        {/* Company Background / Narrative */}
        <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Bookmark className="w-5 h-5 text-indigo-650" />
            <h2 className="text-lg font-bold text-slate-950">Company Background</h2>
          </div>
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            VCard Studio was established in 2026 to bridge the gap between traditional corporate networking and advanced digital mobility. Frustrated by the limitations of paper business cards and the complexity of dynamic digital platforms, our founders set out to build a streamlined, secure, multi-tenant directory service.
          </p>
          <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
            Today, VCard Studio serves thousands of professionals, consultants, and retailers globally. We leverage lightweight, standardized technology stacks to deliver dynamic vCard files and visual portfolios that render perfectly across every screen size. Our commitment to design integrity and data safety remains the core driver of our daily operations.
          </p>
        </section>

        {/* Vision & Mission Split Panels */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mission Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col gap-4">
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl w-fit">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950">Our Mission</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">
                To engineer stable, highly secure virtual profiles that empower business owners to communicate their services, collect leads securely, and maintain professional records without boundaries.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm flex flex-col gap-4">
            <div className="p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl w-fit">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950">Our Vision</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed font-medium">
                To establish a global standard for professional digital credentials that completely eliminates paper card waste and establishes high-trust communication pipelines for physical and virtual networking.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Core Values */}
        <section className="space-y-6 text-center">
          <h2 className="text-xl font-bold text-slate-950">Our Foundation Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-white border border-slate-200 rounded-xl">
              <span className="block text-xs font-black text-indigo-650 uppercase tracking-wider">Reliability</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Platform up-times and lightning fast page loads you can always trust.
              </p>
            </div>
            <div className="p-5 bg-white border border-slate-200 rounded-xl">
              <span className="block text-xs font-black text-indigo-650 uppercase tracking-wider">Privacy</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Strict multi-tenant security rules protecting owner leads and metrics.
              </p>
            </div>
            <div className="p-5 bg-white border border-slate-200 rounded-xl">
              <span className="block text-xs font-black text-indigo-650 uppercase tracking-wider">Simplicity</span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Timeless human design with an intuitive user experience on every page.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Global White Theme Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest">
        <div>© VCard Studio. Premium Identity Systems. All Rights Reserved.</div>
        <div className="mt-2 text-slate-400 font-semibold normal-case flex items-center justify-center gap-3">
          <Link href="/contact" className="text-indigo-650 hover:underline font-bold">
            Contact Support
          </Link>
          <span>•</span>
          <span>Email: <a href="mailto:support@vcard.studio" className="text-indigo-650 hover:underline">support@vcard.studio</a></span>
        </div>
      </footer>
    </div>
  );
}
