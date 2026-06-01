'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

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
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      {/* Header Navigation Bar */}
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

          <div className="flex items-center gap-4">
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

      {/* Main Content Sections */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black text-indigo-700 uppercase tracking-widest">
            Contact Channels
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Get In Touch
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            Have questions about VCard Studio subscriptions, customized enterprise directories, or API integrations? Send us a message and our support directors will respond within 12 hours.
          </p>
        </div>

        {/* Form and Info Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Contact Form Panel */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-slate-905 border-b border-slate-100 pb-3">
              Send Support Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Rahul Varma"
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-colors placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="rahul@gmail.com"
                    className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-colors placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Subject Message</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Subscription queries, bespoke templates request, etc..."
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-colors placeholder:text-slate-400"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-0.5">Your Message *</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Type your questions or specify custom platform requirements here..."
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-600 focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-colors resize-none placeholder:text-slate-400"
                />
              </div>

              {success && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
                  Your message has been registered! We will call/email you back shortly.
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? 'Sending Request...' : 'Send Inquiry Message'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Contact Coordinates Info Panel */}
          <div className="space-y-6">
            {/* Phone & Mail */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-455 border-b border-slate-100 pb-2">
                Corporate Coordinates
              </h3>
              <div className="space-y-3.5 text-xs text-slate-650">
                <div className="flex items-start gap-3">
                  <Phone className="w-4.5 h-4.5 text-indigo-650 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block font-bold text-slate-900">Direct Telephone</span>
                    <span className="block mt-0.5">+91 98765 43210</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-4.5 h-4.5 text-indigo-650 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="block font-bold text-slate-900">Support Inbox</span>
                    <a href="mailto:support@vcard.studio" className="text-indigo-650 hover:underline block mt-0.5 font-bold">
                      support@vcard.studio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Address */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-455 border-b border-slate-100 pb-2">
                Office Location
              </h3>
              <div className="flex items-start gap-3 text-xs text-slate-650">
                <MapPin className="w-4.5 h-4.5 text-indigo-650 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-slate-900">Headquarters</span>
                  <span className="block mt-0.5 leading-relaxed">
                    Suite 104, Royal Palms Plaza, MG Road, Bangalore - 560001
                  </span>
                </div>
              </div>
            </div>

            {/* Operating hours */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-455 border-b border-slate-100 pb-2">
                Operational Hours
              </h3>
              <div className="flex items-start gap-3 text-xs text-slate-650">
                <Clock className="w-4.5 h-4.5 text-indigo-650 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-slate-900">Support Availability</span>
                  <span className="block mt-0.5">Monday to Friday</span>
                  <span className="block text-slate-500 mt-0.5">9:00 AM — 6:00 PM IST</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Global White Theme Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest">
        <div>© VCard Studio. Premium Identity Systems. All Rights Reserved.</div>
        <div className="mt-2 text-slate-400 font-semibold normal-case">
          Need immediate support? Contact us at <a href="mailto:support@vcard.studio" className="text-indigo-655 hover:underline">support@vcard.studio</a>
        </div>
      </footer>
    </div>
  );
}
