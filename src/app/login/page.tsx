'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { dbService } from '../../lib/firestore';
import { Key, Mail, AlertTriangle, ShieldCheck, ArrowRight, UserCheck, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localAuth = localStorage.getItem('vcard_admin_logged');
      if (localAuth === 'true') {
        router.push('/admin');
      } else {
        setCheckingSession(false);
      }
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isFirebaseConfigured && auth) {
        // Firebase Auth Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Retrieve role/tenant mapping
        let profile = await dbService.getUserProfile(user.uid);
        if (!profile) {
          // Auto-provision admin email as super_admin, others as owners
          if (email.toLowerCase() === 'admin@vcard.com') {
            profile = {
              uid: user.uid,
              email: email,
              role: 'super_admin'
            };
          } else {
            // Find if there is an existing business card with this ownerEmail
            const cards = await dbService.getBusinesses();
            const matchingCard = cards.find(c => c.ownerEmail?.toLowerCase() === email.toLowerCase());
            profile = {
              uid: user.uid,
              email: email,
              role: 'business_owner',
              businessId: matchingCard?.id || ''
            };
          }
          await dbService.saveUserProfile(profile);
        }

        // Check account status for business owners
        if (profile.role === 'business_owner' && profile.businessId) {
          const card = await dbService.getBusinessById(profile.businessId);
          if (card && card.status === 'inactive') {
            throw new Error('This account is inactive. Please contact the administrator.');
          }
        }

        // Set sessions
        localStorage.setItem('vcard_admin_logged', 'true');
        localStorage.setItem('vcard_active_user', JSON.stringify(profile));
        setSuccess(true);
        setTimeout(() => router.push('/admin'), 1000);
      } else {
        // Fallback Local Login
        const localCreds = localStorage.getItem('vcard_local_credentials');
        const credentials = localCreds ? JSON.parse(localCreds) : [
          { email: 'admin@vcard.com', password: 'admin123', uid: 'mock-admin' },
          { email: 'apex@owner.com', password: 'owner123', uid: 'mock-owner-apex' }
        ];

        const matched = credentials.find(
          (c: { email: string; password: string; uid: string }) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
        );

        if (matched) {
          let profile = await dbService.getUserProfile(matched.uid);
          if (!profile) {
            if (matched.email.toLowerCase() === 'admin@vcard.com') {
              profile = { uid: matched.uid, email: matched.email, role: 'super_admin' };
            } else {
              profile = { 
                uid: matched.uid, 
                email: matched.email, 
                role: 'business_owner', 
                businessId: 'apex-digital-studio' 
              };
            }
            await dbService.saveUserProfile(profile);
          }

          // Check account status for business owners
          if (profile.role === 'business_owner' && profile.businessId) {
            const card = await dbService.getBusinessById(profile.businessId);
            if (card && card.status === 'inactive') {
              throw new Error('This account is inactive. Please contact the administrator.');
            }
          }

          localStorage.setItem('vcard_admin_logged', 'true');
          localStorage.setItem('vcard_active_user', JSON.stringify(profile));
          setSuccess(true);
          setTimeout(() => router.push('/admin'), 1000);
        } else {
          throw new Error('Authentication failed. Please verify credentials.');
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setEmail('admin@vcard.com');
    setPassword('admin123');
    setError('');
  };

  const handleFillOwner = () => {
    setEmail('apex@owner.com');
    setPassword('owner123');
    setError('');
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 text-stone-900 font-sans">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <div className="p-4 bg-brown-100 border border-brown-200 rounded-full text-brown-755 animate-spin shadow-inner">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="text-xs font-black text-stone-500 uppercase tracking-widest">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-stone-50 text-stone-900 font-sans overflow-hidden px-4 py-8">
      
      {/* Background Subtle Stripe Dot Grid */}
      <div className="absolute inset-0 grid-accent opacity-25 pointer-events-none z-0"></div>

      {/* Full screen loading redirection overlay */}
      {success && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 max-w-sm mx-4 border border-brown-200 text-center">
            <div className="p-4 bg-brown-100 border border-brown-200 rounded-full text-brown-755 animate-spin shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">Access Authorized</h3>
            <p className="text-xs text-stone-550 font-medium leading-relaxed">
              Retrieving tenant credentials and building admin workspace. Redirecting...
            </p>
          </div>
        </div>
      )}
      
      {/* Centered Glass Panel */}
      <div className="relative z-10 w-full max-w-md px-6 py-10 sm:px-8 bg-white border border-brown-200 rounded-3xl shadow-xl flex flex-col items-center">
        
        {/* Shield Header */}
        <div className="p-4 bg-brown-50 border border-brown-200 rounded-full mb-5 flex items-center justify-center text-brown-755 shadow-md">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-stone-900 font-display text-center">
          Administrative Portal
        </h1>
        <p className="text-xs text-stone-500 mt-2 mb-8 text-center font-medium leading-relaxed">
          Secure, multi-tenant administrative workspace for card configuration, metrics, and inquiry databases.
        </p>

        {/* Firebase Config Status Indicator */}
        {!isFirebaseConfigured && (
          <div className="w-full flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-amber-850 text-[11px] font-semibold leading-relaxed shadow-sm">
            <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0 text-amber-700 mt-0.5" />
            <div>
              <span className="font-black block mb-0.5 uppercase tracking-wider text-[10px]">Developer Sandbox Mode</span>
              Firebase is offline. Local registry controls credentials.
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest pl-1">
              Account Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@domain.com"
                className="w-full h-12 pl-11 pr-4 bg-stone-50/50 border border-brown-200 focus:bg-white focus:border-brown-500 focus:outline-none rounded-xl text-xs font-semibold text-stone-900 transition-colors placeholder:text-stone-400 shadow-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Key className="absolute left-4 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-11 pr-4 bg-stone-50/50 border border-brown-200 focus:bg-white focus:border-brown-500 focus:outline-none rounded-xl text-xs font-semibold text-stone-900 transition-colors placeholder:text-stone-400 shadow-sm"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold animate-fadeIn">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-650 text-xs font-bold flex items-center justify-center gap-2 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Access Granted! Redirecting...
            </div>
          )}

          {/* Login Button - Clean Solid Style */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-12 mt-2 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-100 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Authorize Access
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="w-full h-12 border border-brown-200 hover:border-brown-300 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-stone-400" />
            Back to Home
          </Link>
        </form>

        {/* Fallback Auto-Fill Quick Link */}
        {!isFirebaseConfigured && (
          <div className="w-full flex flex-col gap-3 mt-8 pt-5 border-t border-brown-100">
            <span className="text-[9px] uppercase font-black text-stone-400 tracking-widest text-center">
              Identity Bypass Links
            </span>
            <div className="flex gap-3">
              <button
                onClick={handleFillAdmin}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-brown-50 border border-brown-200 hover:border-brown-300 hover:bg-white rounded-xl text-[10px] font-bold text-stone-600 hover:text-stone-900 transition-all shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-brown-700" />
                Super Admin
              </button>
              <button
                onClick={handleFillOwner}
                className="flex-1 flex items-center justify-center gap-2 h-10 bg-brown-50 border border-brown-200 hover:border-brown-300 hover:bg-white rounded-xl text-[10px] font-bold text-stone-600 hover:text-stone-900 transition-all shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-yellow-800" />
                Apex Owner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

