'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { dbService } from '../../lib/firestore';
import { Key, Mail, AlertTriangle, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import { AppUser } from '../../types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localAuth = localStorage.getItem('vcard_admin_logged');
      if (localAuth === 'true') {
        router.push('/admin');
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

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden text-slate-100 font-sans">
      {/* Decorative Gradient Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none animate-pulse" />
      
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

      {/* Main Glassmorphic Panel */}
      <div className="relative z-10 w-full max-w-md px-6 py-8 mx-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl shadow-indigo-950/20 flex flex-col items-center">
        
        {/* Shield Header */}
        <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-full mb-4 flex items-center justify-center text-indigo-400">
          <ShieldCheck className="w-10 h-10 animate-bounce" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-indigo-100 to-purple-200 bg-clip-text text-transparent">
          VCard Portal
        </h1>
        <p className="text-sm text-slate-400 mt-2 mb-8 text-center">
          Secure Multi-Tenant administrative dashboard and analytics hub.
        </p>

        {/* Firebase Config Status Indicator */}
        {!isFirebaseConfigured && (
          <div className="w-full flex items-start gap-3 p-3 bg-amber-950/40 border border-amber-800/30 rounded-xl mb-6 text-amber-300 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <div>
              <span className="font-semibold block mb-0.5">Developer Sandbox Bypass Mode</span>
              Firebase is offline. Local Storage registry handles multi-tenant credentials securely.
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          {/* Email Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
              Account Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-5 h-5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@domain.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-850 hover:border-indigo-500/40 focus:border-indigo-500 focus:outline-none rounded-xl text-sm transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Key className="absolute left-3 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-850 hover:border-indigo-500/40 focus:border-indigo-500 focus:outline-none rounded-xl text-sm transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/30 rounded-xl text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/30 rounded-xl text-emerald-300 text-xs font-medium flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Access Granted! Loading Scoped Workspace...
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Authenticating...' : 'Authorize Login'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Fallback Auto-Fill Quick Link */}
        {!isFirebaseConfigured && (
          <div className="w-full flex flex-col gap-2 mt-6 pt-4 border-t border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">
              Testing Identities
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleFillAdmin}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/30 rounded-xl text-xs text-slate-300 hover:text-white transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                Super Admin
              </button>
              <button
                onClick={handleFillOwner}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950 border border-slate-800 hover:border-purple-500/30 rounded-xl text-xs text-slate-300 hover:text-white transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                Apex Owner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
