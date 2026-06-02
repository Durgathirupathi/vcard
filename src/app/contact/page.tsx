'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Phone, Mail, MapPin, Clock, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    
    // Simulate API registration
    setTimeout(() => {
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
      setTimeout(() => setSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between overflow-x-hidden selection:bg-brown-200/50 selection:text-brown-900">
      
      {/* Background Subtle Stripe Dot Grid */}
      <div className="absolute inset-0 grid-accent opacity-25 pointer-events-none z-0"></div>

      {/* Header Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full glass-panel border-b border-brown-100/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-white border border-brown-200 group-hover:border-brown-550 rounded-xl text-stone-600 group-hover:text-brown-700 transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-stone-500 group-hover:text-stone-900 transition-colors">
              Back to Home
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2.5 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-black shadow-md transition-colors"
            >
              Sign In
            </Link>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-brown-100 border border-brown-200 rounded-lg text-brown-755 shadow-inner animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-brown-900 font-display">
                VCard Studio
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="relative z-10 flex-grow max-w-6xl w-full mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brown-100 border border-brown-200 rounded-full text-[10px] font-black text-brown-700 uppercase tracking-widest shadow-sm animate-fadeIn">
            Contact Channels
          </span>
          <h1 className="text-4xl font-black tracking-tight text-stone-900 font-display">
            Get In <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed font-medium">
            Have questions about VCard Studio subscriptions, customized enterprise directories, or API integrations? Send us a message and our support team will respond within 12 hours.
          </p>
        </div>

        {/* Form and Info Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4 items-start">
          
          {/* Contact Form Panel */}
          <div className="lg:col-span-2 bg-white border border-brown-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
            <h2 className="text-base font-extrabold text-stone-900 border-b border-brown-100 pb-3 font-display">
              Send Support Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-0.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Rahul Varma"
                    className="h-11 px-4 bg-stone-50/50 border border-brown-200 focus:bg-white focus:border-brown-500 focus:outline-none rounded-xl text-xs font-semibold text-stone-900 transition-all placeholder:text-stone-400 shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-0.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="rahul@gmail.com"
                    className="h-11 px-4 bg-stone-50/50 border border-brown-200 focus:bg-white focus:border-brown-500 focus:outline-none rounded-xl text-xs font-semibold text-stone-900 transition-all placeholder:text-stone-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-0.5">Subject Message</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Subscription queries, bespoke templates request, etc..."
                  className="h-11 px-4 bg-stone-50/50 border border-brown-200 focus:bg-white focus:border-brown-500 focus:outline-none rounded-xl text-xs font-semibold text-stone-900 transition-all placeholder:text-stone-400 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-0.5">Your Message *</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Type your questions or specify custom platform requirements here..."
                  className="p-4 bg-stone-50/50 border border-brown-200 focus:bg-white focus:border-brown-500 focus:outline-none rounded-xl text-xs font-semibold text-stone-900 transition-all resize-none placeholder:text-stone-400 shadow-sm"
                />
              </div>

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-650 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
                  <CheckCircle className="w-5 h-5 text-emerald-650 flex-shrink-0" />
                  Your message has been registered! We will email you back shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-black shadow-md hover:scale-[1.01] active:scale-100 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    Send Inquiry Message
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Coordinates Info Panel */}
          <div className="space-y-6">
            {/* Phone & Mail */}
            <div className="bg-white border border-brown-200 rounded-2xl p-6 shadow-md space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-brown-755 border-b border-brown-100 pb-2 font-display">
                Corporate Coordinates
              </h3>
              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-brown-50 border border-brown-200 text-brown-755 rounded-lg shadow-inner">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900">Direct Telephone</span>
                    <span className="block mt-0.5 text-stone-500 font-medium">+91 98765 43210</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-brown-50 border border-brown-200 text-brown-755 rounded-lg shadow-inner">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-bold text-stone-900">Support Inbox</span>
                    <a href="mailto:support@vcard.studio" className="text-brown-755 hover:text-brown-900 hover:underline block mt-0.5 font-bold">
                      support@vcard.studio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Address */}
            <div className="bg-white border border-brown-200 rounded-2xl p-6 shadow-md space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-brown-755 border-b border-brown-100 pb-2 font-display">
                Office Location
              </h3>
              <div className="flex items-start gap-3.5 text-xs text-stone-600">
                <div className="p-2 bg-brown-50 border border-brown-200 text-brown-755 rounded-lg shadow-inner">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-stone-900">Headquarters</span>
                  <span className="block mt-0.5 leading-relaxed text-stone-500 font-medium">
                    Suite 104, Royal Palms Plaza, MG Road, Bangalore - 560001
                  </span>
                </div>
              </div>
            </div>

            {/* Operating hours */}
            <div className="bg-white border border-brown-200 rounded-2xl p-6 shadow-md space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-brown-755 border-b border-brown-100 pb-2 font-display">
                Operational Hours
              </h3>
              <div className="flex items-start gap-3.5 text-xs text-stone-600">
                <div className="p-2 bg-brown-50 border border-brown-200 text-brown-755 rounded-lg shadow-inner">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-white">Support Availability</span>
                  <span className="block mt-0.5 text-stone-500 font-medium">Monday to Friday</span>
                  <span className="block text-stone-400 mt-0.5 font-bold">9:00 AM — 6:00 PM IST</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Global Theme Footer */}
      <footer className="w-full bg-white border-t border-brown-100 py-10 text-center relative z-10 text-stone-450 text-[10px] uppercase font-bold tracking-widest">
        <div>© VCard Studio. Premium Identity Systems. All Rights Reserved.</div>
        <div className="mt-3 text-stone-500 font-semibold normal-case">
          Need immediate support? Contact us at <a href="mailto:support@vcard.studio" className="text-brown-755 hover:text-brown-900 font-bold hover:underline">support@vcard.studio</a>
        </div>
      </footer>
    </div>
  );
}
