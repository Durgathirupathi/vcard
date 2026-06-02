'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

import CardsCounter from '../components/home/CardsCounter';
import RecentBusinesses from '../components/home/RecentBusinesses';
import PopularCategories from '../components/home/PopularCategories';
import FeaturedCarousel from '../components/home/FeaturedCarousel';
import SearchWidget from '../components/home/SearchWidget';
import TemplatesCatalog from '../components/home/TemplatesCatalog';
import QrBenefits from '../components/home/QrBenefits';
import VcfDemo from '../components/home/VcfDemo';
import GrowthBenefits from '../components/home/GrowthBenefits';
import CustomerReviews from '../components/home/CustomerReviews';
import HomeFaq from '../components/home/HomeFaq';
import LatestUpdates from '../components/home/LatestUpdates';
import CallToAction from '../components/home/CallToAction';
import BusinessShowcase from '../components/home/BusinessShowcase';
import HomeContact from '../components/home/HomeContact';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between overflow-x-hidden selection:bg-brown-200/50 selection:text-brown-900">
      
      {/* Background Subtle Stripe Dot Grid */}
      <div className="absolute inset-0 grid-accent opacity-30 pointer-events-none z-0"></div>

      {/* Navigation Header - Premium Warm White Glassmorphism */}
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

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brown-755 transition-colors">
              Features
            </a>
            <a href="#showcase" className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brown-755 transition-colors">
              Templates
            </a>
            <Link href="/about" className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brown-755 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-brown-755 transition-colors">
              Contact
            </Link>
            <Link 
              href="/login" 
              className="px-5 py-2.5 bg-brown-755 hover:bg-brown-700 text-white rounded-xl text-xs font-black shadow-md transition-colors"
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
              <a 
                href="#features" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-brown-755 transition-colors py-2 border-b border-stone-100"
              >
                Features
              </a>
              <a 
                href="#showcase" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-brown-755 transition-colors py-2 border-b border-stone-100"
              >
                Templates
              </a>
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold uppercase tracking-wider text-stone-600 hover:text-brown-755 transition-colors py-2 border-b border-stone-100"
              >
                About
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

      {/* Hero Section - Apple-polished Corporate Layout */}
      <section className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-24 pb-20 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-brown-200 rounded-full text-[10px] font-black text-brown-700 uppercase tracking-widest shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Modern Digital Identity Suite
        </div>

        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none text-stone-900 font-display">
          Elevate Your Brand with <br className="hidden sm:inline" />
          <span className="text-gradient">Premium Business Profiles</span>
        </h1>

        <p className="text-stone-550 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Create beautiful, high-performance, and secure virtual business profiles with real-time VCF contact downloads, lead capture systems, and centralized analytics.
        </p>
      </section>

      {/* Primary Counter & Direct Search Directory */}
      <CardsCounter />
      <SearchWidget />
      <RecentBusinesses />
      <PopularCategories />
      <FeaturedCarousel />



      {/* Templates & QR Benefits Sub-Directory */}
      <TemplatesCatalog />
      <QrBenefits />
      <VcfDemo />
      <GrowthBenefits />



      {/* Customer Endorsements & Frequently Asked Accordions */}
      <BusinessShowcase />
      <CustomerReviews />
      <HomeFaq />
      <LatestUpdates />
      <CallToAction />
      <HomeContact />

      {/* Corporate Footer */}
      <footer className="w-full bg-white border-t border-brown-100 py-12 text-center relative z-10">
        <div className="text-stone-400 text-[10px] uppercase font-bold tracking-widest">
          © VCard Studio. Premium Identity Systems. All Rights Reserved.
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-wider text-stone-500">
          <Link href="/about" className="hover:text-brown-700 transition-colors">
            Corporate Profile
          </Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-brown-700 transition-colors">
            Support Inquiry
          </Link>
          <span>•</span>
          <Link 
            href="/login" 
            className="hover:text-brown-700 transition-colors"
          >
            Administrative Console
          </Link>
        </div>
      </footer>
    </div>
  );
}
