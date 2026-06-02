'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '../../lib/firestore';
import { BusinessCard, Lead, AnalyticsEntry, AppUser } from '../../types';
import { PORTAL_LIMITS } from '../../lib/constants';
import { 
  CreditCard, 
  Mail, 
  Eye, 
  Users, 
  PlusCircle, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Settings,
  Share2,
  ToggleLeft,
  ToggleRight,
  Key,
  ShieldCheck,
  Search,
  Filter,
  X,
  Lock,
  UserCheck,
  Activity,
  Smartphone,
  Laptop,
  Tablet,
  Database,
  CloudLightning
} from 'lucide-react';

export default function AdminDashboard() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsEntry[]>([]);
  const [servicesUsage, setServicesUsage] = useState<Record<string, number>>({});
  const [galleryUsage, setGalleryUsage] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);
  
  // Custom Controls States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Password Reset modal states
  const [resettingCardId, setResettingCardId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        let activeUser: AppUser | null = null;
        const userStr = localStorage.getItem('vcard_active_user');
        if (userStr) {
          activeUser = JSON.parse(userStr);
          setUser(activeUser);
        }

        let fetchCards: BusinessCard[] = [];
        let fetchLeads: Lead[] = [];
        let fetchAnalytics: AnalyticsEntry[] = [];
        const sUsage: Record<string, number> = {};
        const gUsage: Record<string, number> = {};

        if (activeUser && activeUser.role === 'business_owner') {
          // Scoped data for owner
          fetchCards = await dbService.getBusinesses(activeUser.uid);
          fetchLeads = await dbService.getLeads(activeUser.businessId);
          fetchAnalytics = await dbService.getAnalytics(activeUser.businessId);
          
          if (activeUser.businessId) {
            const s = await dbService.getServices(activeUser.businessId);
            const g = await dbService.getGalleryImages(activeUser.businessId);
            sUsage[activeUser.businessId] = s.length;
            gUsage[activeUser.businessId] = g.length;
          }
        } else {
          // Aggregate data for admin
          fetchCards = await dbService.getBusinesses();
          fetchAnalytics = await dbService.getAnalytics();
          
          for (const card of fetchCards) {
            const s = await dbService.getServices(card.id);
            const g = await dbService.getGalleryImages(card.id);
            sUsage[card.id] = s.length;
            gUsage[card.id] = g.length;
          }
        }

        setCards(fetchCards);
        setLeads(fetchLeads);
        setAnalytics(fetchAnalytics);
        setServicesUsage(sUsage);
        setGalleryUsage(gUsage);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleCopyLink = (slug: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/${slug}`;
      navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleToggleStatus = async (cardId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
    await dbService.toggleBusinessStatus(cardId, nextStatus);
    
    // Update local cards state
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, status: nextStatus } : c));
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingCardId || !newPassword) return;

    try {
      await dbService.resetOwnerPassword(resettingCardId, newPassword);
      setResetSuccessMsg('Credentials reset successfully!');
      setNewPassword('');
      setTimeout(() => {
        setResettingCardId(null);
        setResetSuccessMsg('');
      }, 2000);
    } catch (err) {
      console.error('Failed to reset credentials', err);
    }
  };

  // Compute Dashboard Statistics
  const isOwner = user?.role === 'business_owner';
  const ownerCard = isOwner ? cards[0] : null;

  const totalCardsCount = cards.length;
  const activeCardsCount = cards.filter(c => c.status === 'active' || !c.status).length;
  const inactiveCardsCount = cards.filter(c => c.status === 'inactive').length;
  const totalLeadsCount = leads.length;
  const totalViews = analytics.filter(a => a.eventType === 'view').length;

  const stats = isOwner 
    ? [
        { name: 'My Profile Status', value: ownerCard?.status === 'inactive' ? 'Inactive' : 'Active', icon: ShieldCheck, color: 'bg-indigo-50 border border-indigo-100 text-indigo-700', trend: 'Account active & live' },
        { name: 'Leads Received', value: totalLeadsCount, icon: Mail, color: 'bg-emerald-50 border border-emerald-100 text-emerald-700', trend: 'Ready for conversion' },
        { name: 'Total Views', value: totalViews, icon: Eye, color: 'bg-amber-50 border border-amber-100 text-amber-700', trend: 'Tracing dynamic visits' },
        { name: 'Unique Visitors', value: Math.max(1, Math.round(totalViews * 0.72)), icon: Users, color: 'bg-slate-100 border border-slate-200 text-slate-700', trend: '72% average conversion' },
      ]
    : [
        { name: 'Total Businesses', value: totalCardsCount, icon: CreditCard, color: 'bg-indigo-50 border border-indigo-100 text-indigo-700', trend: 'Registered accounts' },
        { name: 'Active Accounts', value: activeCardsCount, icon: ShieldCheck, color: 'bg-emerald-50 border border-emerald-100 text-emerald-700', trend: 'Live profiles' },
        { name: 'Inactive Accounts', value: inactiveCardsCount, icon: Lock, color: 'bg-rose-50 border border-rose-100 text-rose-700', trend: 'Blocked portals' },
        { name: 'Total Page Views', value: totalViews, icon: Eye, color: 'bg-amber-50 border border-amber-100 text-amber-700', trend: 'Aggregated analytics' },
      ];

  // Super Admin Filtering
  const filteredCards = cards.filter(card => {
    const q = searchQuery.toLowerCase();
    const cardStatus = card.status || 'active';
    
    const matchesSearch = 
      card.businessName.toLowerCase().includes(q) ||
      card.ownerName.toLowerCase().includes(q) ||
      card.category.toLowerCase().includes(q);
      
    const matchesStatus = 
      statusFilter === 'all' || 
      cardStatus === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Fetching workspace metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn text-slate-800">
      
      {/* Dashboard Top Header Banner - Clean Solid Accent */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {isOwner ? 'Workspace Dashboard' : 'Centralized Portal Management'}
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium leading-relaxed">
            {isOwner 
              ? `Manage your card details, view recent inquiries, and trace usage limits for ${ownerCard?.businessName || 'your card'}.`
              : 'Audit active tenant cards, toggle account statuses, reset credentials, and monitor uploader limits.'
            }
          </p>
        </div>
        
        {/* Quick Actions Header - Show only for Super Admin */}
        {!isOwner && (
          <div className="flex items-center gap-3">
            <Link
              href="/admin/cards/new"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-2 hover:scale-[1.01]"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              Build New VCard
            </Link>
          </div>
        )}
      </div>

      {/* Grid Statistics Widgets - Clean White Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="p-6 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest">
                  {stat.name}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  {stat.value}
                </span>
              </div>

              <div className="mt-4 text-[10px] text-slate-500 font-bold flex items-center gap-1.5 border-t border-slate-100 pt-3">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Panels Split Section - Clean White surfaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Business Management Directory or Owner Showcase */}
        <div className="lg:col-span-2 space-y-6">
          {isOwner ? (
            // ==========================================
            // BUSINESS OWNER VIEW
            // ==========================================
            <>
              {/* Profile Card Summary */}
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900 pl-0.5">
                Profile Management
              </h2>
              {ownerCard ? (
                <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between p-6">
                  
                  {/* Card Cover Banner & Avatar preview */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-4">
                    {ownerCard.coverImage ? (
                      <img 
                        src={ownerCard.coverImage} 
                        alt="Cover image" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                    
                    <div className="absolute bottom-4 left-6 flex items-end gap-4">
                      {ownerCard.profileImage ? (
                        <img 
                          src={ownerCard.profileImage} 
                          alt={ownerCard.ownerName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow bg-white p-0.5"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-indigo-650 rounded-full flex items-center justify-center font-bold text-xl text-white border-2 border-white shadow">
                          {ownerCard.ownerName.charAt(0)}
                        </div>
                      )}
                      
                      <div className="mb-1 text-left">
                        <span className="block text-lg font-black text-white leading-tight drop-shadow-md">
                          {ownerCard.businessName}
                        </span>
                        <span className="block text-xs font-bold text-slate-100 drop-shadow-md">
                          {ownerCard.ownerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card metadata list */}
                  <div className="grid grid-cols-2 gap-4 my-2 text-xs text-slate-600 border-b border-slate-100 pb-4">
                    <div>
                      <span className="block text-[9px] text-slate-450 uppercase font-black tracking-widest">Category</span>
                      <span className="font-bold text-slate-800">{ownerCard.category}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-455 uppercase font-black tracking-widest">Active Template</span>
                      <span className="inline-block px-3 py-1 mt-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase">
                        {ownerCard.templateId.replace('template', 'Template ')}
                      </span>
                    </div>
                  </div>

                  {/* Copy Link & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleCopyLink(ownerCard.slug)}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black transition-colors w-full sm:w-auto ${
                          copySuccess 
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
                            : 'bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <Share2 className="w-4 h-4" />
                        {copySuccess ? 'Copied Card Link!' : 'Copy Public URL'}
                      </button>
                      
                      <Link
                        href={`/${ownerCard.slug}`}
                        target="_blank"
                        className="p-2.5 bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-600 hover:text-slate-900 rounded-xl transition-all"
                        title="Open Card"
                      >
                        <ExternalLink className="w-4.5 h-4.5" />
                      </Link>
                    </div>

                    <Link
                      href={`/admin/cards/edit/${ownerCard.id}`}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-black transition-colors shadow-sm w-full sm:w-auto"
                    >
                      <Settings className="w-4 h-4" />
                      Configure Card Settings
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-slate-500 text-xs">
                  No business card associated. Please contact the administrator.
                </div>
              )}

              {/* Scoped Owner Usage Statistics Panel */}
              <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Uploader Usage Statistics</h3>
                  <p className="text-xs text-slate-550 mt-0.5">Track your resource allocation and limits configured by the Super Admin.</p>
                </div>
                
                <div className="space-y-4">
                  {/* Services counter bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-650">Services Catalog Space</span>
                      <span className="text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 text-[10px]">
                        {servicesUsage[ownerCard?.id || ''] || 0} / {PORTAL_LIMITS.MAX_SERVICES} Used
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, ((servicesUsage[ownerCard?.id || ''] || 0) / PORTAL_LIMITS.MAX_SERVICES) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Gallery counter bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-650">Gallery Media Space</span>
                      <span className="text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100 text-[10px]">
                        {galleryUsage[ownerCard?.id || ''] || 0} / {PORTAL_LIMITS.MAX_GALLERY_IMAGES} Used
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className="bg-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, ((galleryUsage[ownerCard?.id || ''] || 0) / PORTAL_LIMITS.MAX_GALLERY_IMAGES) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // ==========================================
            // SUPER ADMIN VIEW
            // ==========================================
            <>
              {/* Directory search filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-lg font-extrabold tracking-tight text-slate-900 pl-0.5">
                  Manage Business Accounts
                </h2>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative flex items-center flex-1 sm:w-60">
                    <Search className="absolute left-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search accounts..."
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  {/* Status filter */}
                  <div className="relative flex items-center w-28">
                    <Filter className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={statusFilter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="w-full pl-8 pr-2 py-2 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:0.55rem_auto] bg-[position:right_0.75rem_center] bg-no-repeat"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cards Listing Directory */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
                {filteredCards.length === 0 ? (
                  <div className="p-12 text-center text-slate-550 text-xs">
                    No business accounts matching query or status filter.
                  </div>
                ) : (
                  filteredCards.map((card) => {
                    const cardStatus = card.status || 'active';
                    const isActiveCard = cardStatus === 'active';
                    
                    const sCount = servicesUsage[card.id] || 0;
                    const gCount = galleryUsage[card.id] || 0;

                    return (
                      <div 
                        key={card.id}
                        className="p-5 space-y-4 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            {card.profileImage ? (
                              <img 
                                src={card.profileImage} 
                                alt={card.ownerName}
                                className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0 bg-slate-100"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-lg text-indigo-650 flex-shrink-0">
                                {card.ownerName.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0 text-left">
                              <span className="block text-sm font-bold text-slate-900 truncate group-hover:text-indigo-650 transition-colors">
                                {card.businessName}
                              </span>
                              <span className="block text-xs text-slate-500 truncate font-semibold mt-0.5">
                                {card.ownerName} • {card.category}
                              </span>
                              <span className="block text-[10px] text-slate-450 truncate mt-0.5">
                                Login: {card.ownerEmail || card.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full border ${
                              isActiveCard 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                : 'bg-rose-50 border-rose-100 text-rose-700'
                            }`}>
                              {cardStatus}
                            </span>
                          </div>
                        </div>

                        {/* Usage Counters Gauges */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-500 font-semibold">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span>Services Used</span>
                              <span className="font-bold text-slate-800">{sCount} / {PORTAL_LIMITS.MAX_SERVICES}</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-indigo-650 h-full"
                                style={{ width: `${(sCount / PORTAL_LIMITS.MAX_SERVICES) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span>Gallery Images</span>
                              <span className="font-bold text-slate-800">{gCount} / {PORTAL_LIMITS.MAX_GALLERY_IMAGES}</span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-purple-650 h-full"
                                style={{ width: `${(gCount / PORTAL_LIMITS.MAX_GALLERY_IMAGES) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Super Admin Actions Panel */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleStatus(card.id, cardStatus)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                                isActiveCard 
                                  ? 'bg-rose-50 border-rose-100 hover:border-rose-300 text-rose-700' 
                                  : 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 text-emerald-700'
                              }`}
                            >
                              {isActiveCard ? (
                                <>
                                  <ToggleRight className="w-4.5 h-4.5 text-rose-600" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4.5 h-4.5 text-emerald-600" />
                                  Activate
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={() => setResettingCardId(card.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                            >
                              <Key className="w-4 h-4 text-indigo-650" />
                              Reset Password
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/${card.slug}`}
                              target="_blank"
                              className="p-1.5 bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-800 rounded-lg transition-all"
                              title="Launch Card"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            
                            <Link
                              href={`/admin/cards/edit/${card.id}`}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-lg text-xs font-black transition-colors"
                            >
                              Configure
                            </Link>
                          </div>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column: Scoped leads & inquiries — only for business owners */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
              {isOwner ? 'Recent Leads' : 'Inquiries Status'}
            </h2>
            <Link 
              href="/admin/leads" 
              className="text-xs text-indigo-605 hover:text-indigo-750 font-bold flex items-center gap-0.5"
            >
              Leads Hub
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-sm">
            {leads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">
                No inquiries or leads received yet.
              </div>
            ) : (
              leads.slice(0, 4).map((lead) => {
                const business = cards.find(c => c.id === lead.businessId);
                return (
                  <div key={lead.id} className="p-4 space-y-2 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 text-left">
                        <span className="block text-[10px] font-black text-indigo-755 uppercase tracking-wide truncate">
                          {business?.businessName || 'My Card'}
                        </span>
                        <span className="block text-sm font-bold text-slate-800 truncate mt-0.5">
                          {lead.name}
                        </span>
                        <span className="block text-xs text-slate-500 truncate mt-0.5 font-medium">
                          {lead.mobile} • {lead.email}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-650 italic text-left">
                      &ldquo;{lead.message}&rdquo;
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* ==================================================== */}
      {/* 🚀 ADVANCED DUMMY WIDGETS split panel */}
      {/* ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Widget: Recent events log + system status */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900 pl-0.5">
            System Operations Panel
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Recent Activity Log */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Activity className="w-5 h-5 text-indigo-650" />
                <h3 className="text-sm font-bold text-slate-950">Recent System Activity</h3>
              </div>

              <div className="space-y-4 text-left">
                <div className="relative pl-5 border-l-2 border-slate-200 space-y-1">
                  <span className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                  <span className="block text-[10px] text-slate-450 font-bold">10:15 AM — Today</span>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    Lead record submitted for <span className="text-indigo-600">Mahalakshmi Services</span> by Karthik Rao.
                  </p>
                </div>
                
                <div className="relative pl-5 border-l-2 border-slate-200 space-y-1">
                  <span className="absolute -left-1.5 top-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full" />
                  <span className="block text-[10px] text-slate-450 font-bold">09:30 AM — Today</span>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                    <span className="text-purple-600">Apex Digital Studio</span> visual portfolio images updated by owner.
                  </p>
                </div>

                <div className="relative pl-5 space-y-1">
                  <span className="absolute -left-1 top-1.5 w-2 h-2 bg-slate-350 rounded-full" />
                  <span className="block text-[10px] text-slate-450 font-bold">08:45 AM — Yesterday</span>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    Alternate mobile number successfully changed on <span className="font-semibold text-slate-750">Elite Real Estate</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Integrations & APIs status */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Database className="w-5 h-5 text-indigo-650" />
                <h3 className="text-sm font-bold text-slate-950">Integration Systems</h3>
              </div>

              <div className="space-y-3.5 text-xs text-slate-650 font-semibold">
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <CloudLightning className="w-4 h-4 text-emerald-600" />
                    Firebase Firestore
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    Firebase Auth
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-150 rounded-xl">
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    ImgBB API Proxy
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase rounded-full">
                    Online
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Widget: Device distribution stats */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
            Access Ratio
          </h2>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block border-b border-slate-100 pb-2">
              Device Distribution
            </span>

            <div className="space-y-4 font-semibold text-xs text-slate-650">
              {/* Mobile phone stats */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-800">
                    <Smartphone className="w-4 h-4 text-indigo-650" />
                    Smartphones
                  </span>
                  <span className="font-bold text-slate-900">64%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '64%' }} />
                </div>
              </div>

              {/* Desktop laptop stats */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-800">
                    <Laptop className="w-4 h-4 text-indigo-650" />
                    Desktops & Laptops
                  </span>
                  <span className="font-bold text-slate-900">24%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '24%' }} />
                </div>
              </div>

              {/* Tablet stats */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1 text-slate-800">
                    <Tablet className="w-4 h-4 text-indigo-650" />
                    Tablets
                  </span>
                  <span className="font-bold text-slate-900">12%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Password Reset Modal Overlay - visible only for Super Admin */}
      {resettingCardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-150 pb-3">
              <span className="text-sm font-bold text-slate-900">Reset Credentials</span>
              <button 
                onClick={() => setResettingCardId(null)}
                className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-xs font-bold text-center flex flex-col items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                {resetSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Provide a new secret password for this business owner. They will use this password to sign in to their portal.
                </p>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest pl-1">New Secret Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-650 focus:outline-none rounded-xl text-xs text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl text-xs font-black shadow-sm transition-colors"
                >
                  Configure New Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
