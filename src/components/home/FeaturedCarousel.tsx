'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  const featured = [
    {
      name: 'Elysian Architects',
      category: 'Luxury Real Estate & Build',
      desc: 'Designing sustainable, high-end residential estates across coastal properties and metropolis centers.',
      initial: 'E',
      quote: 'Our dynamic vCard from VCard Studio has streamlined client communications on-site.'
    },
    {
      name: 'Vanguard Wealth Consulting',
      category: 'Financial Advising & Asset Management',
      desc: 'Bespoke estate planning and investment advisement solutions tailored for corporate executives.',
      initial: 'V',
      quote: 'The digital business profile perfectly aligns with our enterprise-level brand aesthetics.'
    },
    {
      name: 'Greenhouse Organics',
      category: 'Retail Store & Delivery',
      desc: 'Instant delivery of farm-to-table organic produce and sustainable kitchenware ingredients.',
      initial: 'G',
      quote: 'WhatsApp checkout integration increased our daily boutique store orders by 35%.'
    }
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % featured.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + featured.length) % featured.length);
  };

  return (
    <section className="relative z-10 max-w-5xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brown-700">Enterprise Excellence</span>
        <h2 className="text-2xl font-extrabold text-stone-900 font-display">Featured Business Partners</h2>
      </div>

      <div className="bg-white border border-brown-200 rounded-3xl p-6 pb-16 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between min-h-[280px]">
        {/* Left Side: Avatar and Description */}
        <div className="flex-1 space-y-4 text-left">
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 bg-brown-50 text-brown-700 border border-brown-200 rounded-full">
            {featured[activeSlide].category}
          </span>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-brown-100 border border-brown-200 flex items-center justify-center font-black text-xl text-brown-755 shadow-inner">
              {featured[activeSlide].initial}
            </div>
            <div>
              <h3 className="text-lg font-black text-stone-900 font-display">{featured[activeSlide].name}</h3>
              <p className="text-xs text-stone-400 font-medium">{featured[activeSlide].category}</p>
            </div>
          </div>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium pt-2">
            {featured[activeSlide].desc}
          </p>
        </div>

        {/* Right Side: Customer Testimony / Quote */}
        <div className="flex-1 bg-brown-50/50 border border-brown-100 rounded-2xl p-6 relative w-full text-left">
          <Quote className="w-8 h-8 text-brown-200 absolute top-4 right-4" />
          <p className="text-stone-600 text-xs italic leading-relaxed font-medium relative z-10 pt-2">
            &ldquo;{featured[activeSlide].quote}&rdquo;
          </p>
          <div className="mt-4 pt-4 border-t border-brown-100/50 flex items-center justify-between">
            <Link 
              href="/login" 
              className="text-[10px] font-black text-brown-755 hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              Explore Profile
            </Link>
          </div>
        </div>

        {/* Navigation Buttons absolute or integrated */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-10 flex items-center gap-2 z-20">
          <button 
            onClick={handlePrev}
            className="p-2 bg-white hover:bg-stone-50 border border-brown-200 rounded-xl text-stone-500 hover:text-stone-900 shadow-sm transition-colors"
            aria-label="Previous Featured Card"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={handleNext}
            className="p-2 bg-white hover:bg-stone-50 border border-brown-200 rounded-xl text-stone-500 hover:text-stone-900 shadow-sm transition-colors"
            aria-label="Next Featured Card"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selectable dot indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-6">
        {featured.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${activeSlide === idx ? 'bg-brown-700 w-5' : 'bg-brown-200 hover:bg-brown-300'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
