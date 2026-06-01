'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { 
  LayoutDashboard, 
  CreditCard, 
  Mail, 
  Layers, 
  LogOut, 
  User, 
  X,
  Sparkles
} from 'lucide-react';
import { AppUser } from '../../types';

interface SidebarProps {
  onMobileToggle?: () => void;
  isMobileOpen?: boolean;
}

export default function Sidebar({ onMobileToggle, isMobileOpen = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<AppUser | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('vcard_active_user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
    } catch (err) {
      console.error('Firebase signout failed, clearing local', err);
    }
    localStorage.removeItem('vcard_admin_logged');
    localStorage.removeItem('vcard_active_user');
    router.push('/login');
  };

  const navItems = [];
  if (user?.role === 'business_owner') {
    navItems.push({ name: 'Dashboard', path: '/admin', icon: LayoutDashboard });
    if (user.businessId) {
      navItems.push({ name: 'My Business Card', path: `/admin/cards/edit/${user.businessId}`, icon: CreditCard });
    }
    navItems.push({ name: 'Inquiries & Leads', path: '/admin/leads', icon: Mail });
  } else {
    navItems.push({ name: 'Dashboard', path: '/admin', icon: LayoutDashboard });
    navItems.push({ name: 'Business Cards', path: '/admin/cards', icon: CreditCard });
    navItems.push({ name: 'Leads & Enquiries', path: '/admin/leads', icon: Mail });
    navItems.push({ name: 'Template Showcase', path: '/admin/templates', icon: Layers });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-650">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              VCard Studio
            </span>
            <span className="block text-[10px] text-indigo-650 font-bold tracking-widest uppercase">
              {user?.role === 'business_owner' ? 'Owner Portal' : 'Admin Suite'}
            </span>
          </div>
        </Link>
        {onMobileToggle && (
          <button 
            onClick={onMobileToggle}
            className="md:hidden p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-850'
              }`}
              onClick={() => onMobileToggle && onMobileToggle()}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-650'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2">
          <div className="p-2 bg-slate-200 rounded-full text-slate-600">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-sm font-bold truncate text-slate-800">
              {user?.role === 'business_owner' ? 'Business Owner' : 'Super Admin'}
            </span>
            <span className="block text-xs text-slate-450 truncate">
              {user?.email || 'admin@vcard.com'}
            </span>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-650 rounded-xl text-xs font-semibold tracking-wide transition-all uppercase"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Slide-In Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar Desktop Drawer Container */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 flex-shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}
