'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function HomeContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-10 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          
          {/* Left Column: Direct coordinates */}
          <div className="lg:col-span-2 space-y-6 text-left flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-brown-700">Get In Touch</span>
              <h2 className="text-2xl font-extrabold text-stone-900 font-display">Corporate Channels</h2>
              <p className="text-xs text-stone-500 leading-relaxed font-medium">
                Our support team is ready to assist you with customized multi-tenant enterprise configurations.
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-brown-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brown-50 border border-brown-150 text-brown-755 rounded-xl shadow-inner">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-stone-400 font-black uppercase tracking-widest">Phone Direct</span>
                  <a href="tel:+919876543210" className="text-xs font-bold text-stone-800 hover:text-brown-755 hover:underline">+91 (987) 654-3210</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brown-50 border border-brown-150 text-brown-755 rounded-xl shadow-inner">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-stone-400 font-black uppercase tracking-widest">Support Email</span>
                  <a href="mailto:support@vcard.studio" className="text-xs font-bold text-stone-800 hover:text-brown-755 hover:underline">support@vcard.studio</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brown-50 border border-brown-150 text-brown-755 rounded-xl shadow-inner">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-stone-400 font-black uppercase tracking-widest">Corporate Headquarters</span>
                  <span className="text-xs font-bold text-stone-800">Bangalore, Karnataka, India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form */}
          <div className="lg:col-span-3 bg-stone-50 border border-brown-100 rounded-2xl p-6 text-left shadow-inner">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">Inquiry Submitted!</h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed font-medium">
                  We have successfully logged your inquiry ticket. A corporate manager will reach out within 24 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest pl-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name..."
                      className="px-4 py-2.5 bg-white border border-brown-200 focus:border-brown-500 focus:outline-none rounded-xl text-xs text-stone-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest pl-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Your email..."
                      className="px-4 py-2.5 bg-white border border-brown-200 focus:border-brown-500 focus:outline-none rounded-xl text-xs text-stone-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest pl-1">Your Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your requirements..."
                    className="px-4 py-2.5 bg-white border border-brown-200 focus:border-brown-500 focus:outline-none rounded-xl text-xs text-stone-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Inquiry...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Support Request
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
