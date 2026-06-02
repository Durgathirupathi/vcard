'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Bookmark, Menu, X } from 'lucide-react';

import AboutStats from '../../components/about/AboutStats';
import JourneyTimeline from '../../components/about/JourneyTimeline';
import MissionWidget from '../../components/about/MissionWidget';
import VisionWidget from '../../components/about/VisionWidget';
import CoreValues from '../../components/about/CoreValues';
import WhyChooseUs from '../../components/about/WhyChooseUs';
import TeamMembers from '../../components/about/TeamMembers';
import Achievements from '../../components/about/Achievements';
import TechStack from '../../components/about/TechStack';
import CustomerSuccess from '../../components/about/CustomerSuccess';
import AboutTestimonials from '../../components/about/AboutTestimonials';
import Partners from '../../components/about/Partners';
import NicheCategories from '../../components/about/NicheCategories';
import AboutContactInfo from '../../components/about/AboutContactInfo';
import OfficeLocation from '../../components/about/OfficeLocation';
import SupportHelp from '../../components/about/SupportHelp';
import AboutFaq from '../../components/about/AboutFaq';
import Newsletter from '../../components/about/Newsletter';
import SocialMedia from '../../components/about/SocialMedia';
import ContactCta from '../../components/about/ContactCta';

export default function AboutUsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  return (
    <div className="relative min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between overflow-x-hidden selection:bg-brown-200/50 selection:text-brown-900">
      
      {/* Background Subtle Stripe Dot Grid */}
      <div className="absolute inset-0 grid-accent opacity-25 pointer-events-none z-0"></div>

      {/* Primary Header Navigation */}
      <nav className="sticky top-0 z-50 w-full glass-panel border-b border-brown-100/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 bg-brown-100 border border-brown-200 rounded-xl text-brown-700 shadow-inner">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-brown-900 font-display">
              VCard Studio
            </span>
          </Link>
 
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brown-755 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
            <Link href="/contact" className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brown-755 transition-colors">
              Contact
            </Link>
            <Link 
              href="/login" 
              className="px-4 py-2.5 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-black shadow-md transition-colors"
            >
              Sign In
            </Link>
          </div>
 
          {/* Mobile Navigation Toggle (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-stone-600 hover:text-brown-755 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
 
        {/* Mobile Navigation Drawer / Overlay */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-brown-100/50 bg-stone-50/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col px-6 py-6 space-y-4 shadow-xl">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-brown-755 transition-colors py-2 border-b border-stone-100 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-brown-755 transition-colors py-2 border-b border-stone-100"
              >
                Contact
              </Link>
              <Link 
                href="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center px-5 py-3 bg-brown-755 hover:bg-brown-700 text-white rounded-xl text-sm font-black shadow-md transition-colors mt-2"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow max-w-4xl w-full mx-auto px-6 py-20 space-y-20">
        {/* Core Brand Introduction */}
        <section className="text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brown-100 border border-brown-200 rounded-full text-[10px] font-black text-brown-700 uppercase tracking-widest shadow-sm">
            Corporate Profile
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-stone-900 font-display">
            About <span className="text-gradient">VCard Studio</span>
          </h1>
          <p className="text-stone-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            We are dedicated to building robust, accessible, and elegant virtual identity networks. Our software enables global enterprises and individual owners to share credentials with absolute ease.
          </p>
        </section>

        {/* Company Statistics & Counter widgets */}
        <AboutStats />

        {/* Company Background / Narrative */}
        <section className="bg-white border border-brown-200 rounded-2xl p-8 sm:p-10 shadow-md space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-brown-100 pb-4">
            <div className="p-2.5 bg-brown-50 border border-brown-200 text-brown-700 rounded-xl shadow-inner">
              <Bookmark className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-stone-900 font-display">Company Background</h2>
          </div>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-medium">
            VCard Studio was established in 2026 to bridge the gap between traditional corporate networking and advanced digital mobility. Frustrated by the limitations of paper business cards and the complexity of dynamic digital platforms, our founders set out to build a streamlined, secure, multi-tenant directory service.
          </p>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-medium">
            Today, VCard Studio serves thousands of professionals, consultants, and retailers globally. We leverage lightweight, standardized technology stacks to deliver dynamic vCard files and visual portfolios that render perfectly across every screen size. Our commitment to design integrity and data safety remains the core driver of our daily operations.
          </p>
        </section>



        {/* Extended Strategic Mission, Vision, and Journey Timeline */}
        <MissionWidget />
        <VisionWidget />
        <JourneyTimeline />



        {/* Corporate Deep Dive Value Proposition & Onboarding Suite */}
        <CoreValues />
        <WhyChooseUs />
        <TeamMembers />
        <Achievements />
        <TechStack />
        <CustomerSuccess />
        <AboutTestimonials />
        <Partners />
        <NicheCategories />
        <AboutContactInfo />
        <OfficeLocation />
        <SupportHelp />
        <AboutFaq />
        <Newsletter />
        <SocialMedia />
        <ContactCta />
      </main>

      {/* Global Theme Footer */}
      <footer className="w-full bg-white border-t border-brown-100 py-10 text-center relative z-10 text-stone-400 text-[10px] uppercase font-bold tracking-widest">
        <div>© VCard Studio. Premium Identity Systems. All Rights Reserved.</div>
        <div className="mt-3 text-stone-500 font-semibold normal-case flex items-center justify-center gap-3">
          <Link href="/contact" className="text-brown-700 hover:text-brown-755 font-bold hover:underline">
            Contact Support
          </Link>
          <span>•</span>
          <span>Email: <a href="mailto:support@vcard.studio" className="text-brown-700 hover:text-brown-755 font-bold hover:underline">support@vcard.studio</a></span>
        </div>
      </footer>
    </div>
  );
}

