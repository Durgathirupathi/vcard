'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Loader2, Mail } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <section className="relative z-10 max-w-4xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden">
        
        {/* Dot pattern backing */}
        <div className="absolute inset-0 grid-accent opacity-15 pointer-events-none z-0"></div>

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <div className="p-3 bg-brown-50 border border-brown-100 rounded-2xl text-brown-755 w-fit mx-auto shadow-inner">
            <Mail className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 font-display">Subscribe Corporate Newsletter</h2>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed font-medium">
            Stay updated with new visual templates, feature enhancements, and NFC logistics announcements.
          </p>

          {success ? (
            <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-xs font-bold flex flex-col items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Subscription Confirmed! Welcome aboard.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-4 text-left">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter corporate email..."
                className="flex-1 px-4 py-3 bg-stone-50 border border-brown-200 focus:border-brown-500 focus:outline-none rounded-xl text-xs text-stone-850"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
