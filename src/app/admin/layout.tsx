'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '../../components/admin/Sidebar';
import { Menu, Sparkles } from 'lucide-react';
import { AppUser } from '../../types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localAuth = localStorage.getItem('vcard_admin_logged');
      if (localAuth !== 'true') {
        router.push('/login');
        return;
      }

      const userStr = localStorage.getItem('vcard_active_user');
      if (!userStr) {
        // Fallback session for legacy login compatibility
        const fallbackAdmin: AppUser = {
          uid: 'mock-admin',
          email: 'admin@vcard.com',
          role: 'super_admin'
        };
        localStorage.setItem('vcard_active_user', JSON.stringify(fallbackAdmin));
        setAuthorized(true);
        setChecking(false);
        return;
      }

      const user: AppUser = JSON.parse(userStr);

      if (user.role === 'business_owner') {
        const busId = user.businessId;

        // Path rules for business owners
        const isCardsRoot = pathname === '/admin/cards';
        const isCreatingCard = pathname === '/admin/cards/new';
        const isTemplates = pathname === '/admin/templates';
        const isEditingOtherCard = pathname.startsWith('/admin/cards/edit/') && !pathname.startsWith(`/admin/cards/edit/${busId}`);

        if (isCardsRoot) {
          router.push(`/admin/cards/edit/${busId}`);
          return;
        }

        if (isCreatingCard || isTemplates || isEditingOtherCard) {
          alert('Security Notice: Access restricted. You are not authorized to view this administrative resource.');
          router.push('/admin');
          return;
        }
      }

      setAuthorized(true);
      setChecking(false);
    }
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 animate-spin">
            <Sparkles className="w-8 h-8" />
          </div>
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
            Loading Admin Workspace...
          </span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Prevent UI flash during redirect
  }

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 overflow-x-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar 
        isMobileOpen={isMobileOpen} 
        onMobileToggle={() => setIsMobileOpen(!isMobileOpen)} 
      />

      {/* Main Administrative Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-indigo-200 via-indigo-100 to-purple-200 bg-clip-text text-transparent">
              VCard Studio
            </span>
          </div>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Workspace Children */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
