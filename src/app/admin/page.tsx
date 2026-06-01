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
  UserCheck
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
          // Aggregate data for admin — leads not shown to super admin
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
      setResetSuccessMsg('Credentials reset successfully! Bypass maps updated.');
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
        { name: 'My Profile Status', value: ownerCard?.status === 'inactive' ? 'Inactive' : 'Active', icon: ShieldCheck, color: ownerCard?.status === 'inactive' ? 'from-rose-600 to-red-500' : 'from-indigo-600 to-blue-500', trend: 'Account active & live' },
        { name: 'Leads Received', value: totalLeadsCount, icon: Mail, color: 'from-emerald-600 to-teal-500', trend: 'Ready for conversion' },
        { name: 'Total Views', value: totalViews, icon: Eye, color: 'from-purple-600 to-pink-500', trend: 'Tracing dynamic visits' },
        { name: 'Unique Visitors', value: Math.max(1, Math.round(totalViews * 0.72)), icon: Users, color: 'from-amber-600 to-orange-500', trend: '72% average conversion' },
      ]
    : [
        { name: 'Total Businesses', value: totalCardsCount, icon: CreditCard, color: 'from-indigo-600 to-blue-500', trend: 'Registered accounts' },
        { name: 'Active Accounts', value: activeCardsCount, icon: ShieldCheck, color: 'from-emerald-600 to-teal-500', trend: 'Live profiles' },
        { name: 'Inactive Accounts', value: inactiveCardsCount, icon: Lock, color: 'from-rose-600 to-red-500', trend: 'Blocked portals' },
        { name: 'Total Page Views', value: totalViews, icon: Eye, color: 'from-amber-600 to-orange-500', trend: 'Aggregated analytics' },
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
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Fetching workspace metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Dashboard Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            {isOwner ? 'Business Dashboard' : 'Centralized Portal Management'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
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
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-950/40 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              Build New VCard
            </Link>
          </div>
        )}
      </div>

      {/* Grid Statistics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx}
              className="relative p-6 bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl flex flex-col justify-between overflow-hidden group shadow-lg"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300" />
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {stat.name}
                </span>
                <div className={`p-2.5 bg-gradient-to-br ${stat.color} text-white rounded-xl`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  {stat.value}
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-500 font-semibold flex items-center gap-1.5 border-t border-slate-850 pt-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Panels Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Business Management Directory or Owner Showcase */}
        <div className="lg:col-span-2 space-y-6">
          {isOwner ? (
            // ==========================================
            // BUSINESS OWNER VIEW
            // ==========================================
            <>
              {/* Profile Card Summary */}
              <h2 className="text-xl font-bold tracking-tight text-slate-200 pl-1">
                Profile Management
              </h2>
              {ownerCard ? (
                <div className="relative overflow-hidden bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl flex flex-col justify-between p-6 group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-600/10 transition-all duration-500" />
                  
                  {/* Card Cover Banner & Avatar preview */}
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/60 mb-4">
                    {ownerCard.coverImage ? (
                      <img 
                        src={ownerCard.coverImage} 
                        alt="Cover image" 
                        className="w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-indigo-950/40 to-slate-950" />
                    )}
                    
                    <div className="absolute bottom-4 left-6 flex items-end gap-4">
                      {ownerCard.profileImage ? (
                        <img 
                          src={ownerCard.profileImage} 
                          alt={ownerCard.ownerName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 shadow-md bg-slate-900"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xl text-indigo-400 border-2 border-indigo-500 shadow-md">
                          {ownerCard.ownerName.charAt(0)}
                        </div>
                      )}
                      
                      <div className="mb-1 text-left">
                        <span className="block text-lg font-extrabold text-white leading-tight drop-shadow-md">
                          {ownerCard.businessName}
                        </span>
                        <span className="block text-xs font-semibold text-slate-300 drop-shadow-md">
                          {ownerCard.ownerName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card metadata list */}
                  <div className="grid grid-cols-2 gap-4 my-2 text-sm text-slate-350 border-b border-slate-850 pb-4">
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Category</span>
                      <span className="font-semibold text-slate-300">{ownerCard.category}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Template</span>
                      <span className="inline-block px-2.5 py-0.5 mt-0.5 bg-indigo-950/40 border border-indigo-800/30 text-indigo-400 rounded-full text-xs font-bold uppercase">
                        {ownerCard.templateId.replace('template', 'Template ')}
                      </span>
                    </div>
                  </div>

                  {/* Copy Link & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleCopyLink(ownerCard.slug)}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all w-full sm:w-auto ${
                          copySuccess 
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400' 
                            : 'bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Share2 className="w-4 h-4" />
                        {copySuccess ? 'Copied Card Link!' : 'Copy Public URL'}
                      </button>
                      
                      <Link
                        href={`/${ownerCard.slug}`}
                        target="_blank"
                        className="p-2.5 bg-slate-950 border border-slate-850 hover:border-slate-750 text-slate-300 hover:text-white rounded-xl transition-all"
                        title="Open Card"
                      >
                        <ExternalLink className="w-4.5 h-4.5" />
                      </Link>
                    </div>

                    <Link
                      href={`/admin/cards/edit/${ownerCard.id}`}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-950/20 w-full sm:w-auto hover:scale-[1.02]"
                    >
                      <Settings className="w-4 h-4" />
                      Configure Card Settings
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl text-center text-slate-500 text-sm">
                  No business card associated. Please contact the administrator.
                </div>
              )}

              {/* Scoped Owner Usage Statistics Panel */}
              <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">Uploader Usage Statistics</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Track your resource allocation and limits configured by the Super Admin.</p>
                </div>
                
                <div className="space-y-4">
                  {/* Services counter bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-300">Services Catalog Space</span>
                      <span className="text-indigo-400 bg-indigo-950/30 px-2 py-0.5 rounded-full border border-indigo-900/30">
                        {servicesUsage[ownerCard?.id || ''] || 0} / {PORTAL_LIMITS.MAX_SERVICES} Used
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, ((servicesUsage[ownerCard?.id || ''] || 0) / PORTAL_LIMITS.MAX_SERVICES) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Gallery counter bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-300">Gallery Media Space</span>
                      <span className="text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded-full border border-purple-900/30">
                        {galleryUsage[ownerCard?.id || ''] || 0} / {PORTAL_LIMITS.MAX_GALLERY_IMAGES} Used
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, ((galleryUsage[ownerCard?.id || ''] || 0) / PORTAL_LIMITS.MAX_GALLERY_IMAGES) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Settings metadata */}
              <div className="p-5 bg-slate-900/40 border border-slate-800/80 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3.5 bg-indigo-950/40 border border-indigo-900/20 text-indigo-400 rounded-xl">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Account Credentials</span>
                    <span className="block text-sm font-semibold text-slate-300 mt-0.5">{user?.email}</span>
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider">Status Banner</span>
                  <span className="inline-block px-3 py-1 mt-1 bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-xs font-extrabold uppercase rounded-full">
                    Active Account
                  </span>
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
                <h2 className="text-xl font-bold tracking-tight text-slate-200 pl-1">
                  Manage Business Accounts
                </h2>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative flex items-center flex-1 sm:w-60">
                    <Search className="absolute left-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search accounts..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-900/40 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-200 placeholder:text-slate-500"
                    />
                  </div>
                  {/* Status filter */}
                  <div className="relative flex items-center w-28">
                    <Filter className="absolute left-3 w-4 h-4 text-slate-500 pointer-events-none" />
                    <select
                      value={statusFilter}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="w-full pl-8 pr-2 py-2 bg-slate-900/40 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-300 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:0.55rem_auto] bg-[position:right_0.75rem_center] bg-no-repeat"
                    >
                      <option value="all" className="bg-slate-950">All Status</option>
                      <option value="active" className="bg-slate-950">Active</option>
                      <option value="inactive" className="bg-slate-950">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cards Listing Directory */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-850 shadow-md">
                {filteredCards.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
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
                        className="p-5 space-y-4 hover:bg-slate-850/20 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            {card.profileImage ? (
                              <img 
                                src={card.profileImage} 
                                alt={card.ownerName}
                                className="w-12 h-12 rounded-full object-cover border border-slate-800 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-lg text-indigo-400 flex-shrink-0">
                                {card.ownerName.charAt(0)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="block text-sm font-bold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                                {card.businessName}
                              </span>
                              <span className="block text-xs text-slate-400 truncate">
                                {card.ownerName} • {card.category}
                              </span>
                              <span className="block text-[10px] text-slate-500 truncate mt-0.5">
                                Login: {card.ownerEmail || card.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status indicator badge */}
                            <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${
                              isActiveCard 
                                ? 'bg-emerald-950/40 border-emerald-900/30 text-emerald-400' 
                                : 'bg-red-950/40 border-red-900/30 text-red-400'
                            }`}>
                              {cardStatus}
                            </span>
                          </div>
                        </div>

                        {/* Usage Counters gauges */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-950/40 border border-slate-850 rounded-xl p-3.5 text-xs text-slate-400">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span>Services Used</span>
                              <span className="font-semibold text-slate-300">{sCount} / {PORTAL_LIMITS.MAX_SERVICES}</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full"
                                style={{ width: `${(sCount / PORTAL_LIMITS.MAX_SERVICES) * 100}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span>Gallery Images</span>
                              <span className="font-semibold text-slate-300">{gCount} / {PORTAL_LIMITS.MAX_GALLERY_IMAGES}</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                                style={{ width: `${(gCount / PORTAL_LIMITS.MAX_GALLERY_IMAGES) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Super Admin Actions Panel */}
                        <div className="flex items-center justify-between border-t border-slate-850/60 pt-3">
                          <div className="flex gap-2">
                            {/* Toggle status switch */}
                            <button
                              onClick={() => handleToggleStatus(card.id, cardStatus)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all ${
                                isActiveCard 
                                  ? 'bg-red-950/20 border-red-900/30 hover:border-red-650 text-red-400' 
                                  : 'bg-emerald-950/20 border-emerald-900/30 hover:border-emerald-650 text-emerald-400'
                              }`}
                            >
                              {isActiveCard ? (
                                <>
                                  <ToggleRight className="w-4.5 h-4.5 text-red-400" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="w-4.5 h-4.5 text-emerald-400" />
                                  Activate
                                </>
                              )}
                            </button>
                            
                            {/* Reset password button */}
                            <button
                              onClick={() => setResettingCardId(card.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-850 hover:border-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all"
                            >
                              <Key className="w-4 h-4 text-indigo-400" />
                              Reset Password
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/${card.slug}`}
                              target="_blank"
                              className="p-1.5 bg-slate-950 border border-slate-850 hover:border-slate-750 text-slate-400 hover:text-white rounded-lg transition-all"
                              title="Launch Card"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            
                            <Link
                              href={`/admin/cards/edit/${card.id}`}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all"
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

        {/* Right Column: Scoped leads & enquiries — only for business owners */}
        {isOwner && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-200">
              Recent Leads
            </h2>
            <Link 
              href="/admin/leads" 
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              Leads Hub
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-850 shadow-md">
            {leads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No inquiries or leads received yet.
              </div>
            ) : (
              leads.slice(0, 4).map((lead) => {
                const business = cards.find(c => c.id === lead.businessId);
                return (
                  <div key={lead.id} className="p-4 space-y-2 hover:bg-slate-850/20 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 text-left">
                        <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wide truncate">
                          {business?.businessName || 'My Card'}
                        </span>
                        <span className="block text-sm font-bold text-slate-200 truncate mt-0.5">
                          {lead.name}
                        </span>
                        <span className="block text-xs text-slate-400 truncate mt-0.5">
                          {lead.mobile} • {lead.email}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap bg-slate-950/60 px-2 py-0.5 rounded-full">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                    <div className="p-2.5 bg-slate-950/50 border border-slate-850 rounded-xl text-xs text-slate-350 italic text-left">
                      &ldquo;{lead.message}&rdquo;
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        )}

      </div>

      {/* Password Reset Modal Overlay - visible only for Super Admin */}
      {resettingCardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm transition-opacity">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <span className="text-sm font-bold text-slate-200">Reset Credentials</span>
              <button 
                onClick={() => setResettingCardId(null)}
                className="p-1 text-slate-500 hover:text-slate-300 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccessMsg ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-900/30 rounded-xl text-emerald-300 text-xs font-semibold text-center flex flex-col items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                {resetSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Provide a new secret password for this business owner. They will use this password to sign in to their portal.
                </p>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">New Secret Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-950/20"
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
