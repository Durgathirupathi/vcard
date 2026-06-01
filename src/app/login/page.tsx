'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { dbService } from '../../lib/firestore';
import { Key, Mail, AlertTriangle, ShieldCheck, ArrowRight, UserCheck, ArrowLeft, Sparkles } from 'lucide-react';
import { AppUser } from '../../types';

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
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-800 font-sans">
        <div className="flex flex-col items-center gap-4 animate-fadeIn">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-650 animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-slate-550 uppercase tracking-widest">
            Verifying Admin Session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-800 font-sans">
      
      {/* Full screen loading redirection overlay */}
      {success && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4 max-w-sm mx-4 border border-slate-100">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-650 animate-spin">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-slate-900">Access Authorized</h3>
            <p className="text-xs text-slate-500 text-center font-medium leading-relaxed">
              Retrieving tenant credentials and building admin workspace. Redirecting...
            </p>
          </div>
        </div>
      )}
      
      {/* Centered Classic White Panel */}
      <div className="w-full max-w-md px-6 py-8 mx-4 bg-white border border-slate-200 rounded-2xl shadow-md flex flex-col items-center">
        
        {/* Shield Header */}
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-full mb-4 flex items-center justify-center text-slate-700">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Administrative Portal
        </h1>
        <p className="text-xs text-slate-500 mt-2 mb-8 text-center font-medium leading-relaxed">
          Secure, multi-tenant administrative workspace for card configuration, metrics, and inquiry databases.
        </p>

        {/* Firebase Config Status Indicator */}
        {!isFirebaseConfigured && (
          <div className="w-full flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl mb-6 text-amber-800 text-[11px] font-semibold leading-relaxed">
            <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 uppercase tracking-wide text-[10px]">Developer Sandbox Mode</span>
              Firebase is offline. Local registry controls multi-tenant credentials securely.
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest pl-1">
              Account Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-550 uppercase tracking-widest pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Key className="absolute left-3.5 w-4.5 h-4.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:border-indigo-600 focus:bg-white focus:outline-none rounded-xl text-xs font-semibold text-slate-800 transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Access Granted! Redirecting...
            </div>
          )}

          {/* Login Button - Clean Solid Style */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-2 py-3.5 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl text-xs font-black shadow-sm transition-colors flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-100 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Authenticating...' : 'Authorize Access'}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="w-full py-3 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-650 hover:text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            Back to Home
          </Link>
        </form>

        {/* Fallback Auto-Fill Quick Link */}
        {!isFirebaseConfigured && (
          <div className="w-full flex flex-col gap-2 mt-8 pt-5 border-t border-slate-100">
            <span className="text-[9px] uppercase font-black text-slate-400 tracking-widest text-center">
              Identity Bypass Links
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleFillAdmin}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 hover:border-indigo-500/30 hover:bg-white rounded-xl text-[10px] font-bold text-slate-650 hover:text-slate-800 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                Super Admin
              </button>
              <button
                onClick={handleFillOwner}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 hover:border-purple-500/30 hover:bg-white rounded-xl text-[10px] font-bold text-slate-650 hover:text-slate-800 transition-all"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                Apex Owner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
