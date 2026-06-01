'use client';

import React, { useState, useEffect } from 'react';
import { dbService } from '../../../lib/firestore';
import { Lead, BusinessCard, AppUser } from '../../../types';
import { 
  Search, 
  Trash2, 
  Download, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase,
  AlertTriangle
} from 'lucide-react';

export default function LeadsHubPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        let activeUser: AppUser | null = null;
        const userStr = localStorage.getItem('vcard_active_user');
        if (userStr) {
          activeUser = JSON.parse(userStr);
          setCurrentUser(activeUser);
        }

        let fetchLeads: Lead[] = [];
        let fetchCards: BusinessCard[] = [];

        if (activeUser && activeUser.role === 'business_owner') {
          fetchLeads = await dbService.getLeads(activeUser.businessId);
          fetchCards = await dbService.getBusinesses(activeUser.uid);
          if (activeUser.businessId) {
            setSelectedCardId(activeUser.businessId);
          }
        } else {
          // Super admin: don't fetch all leads — only load per-business on selection
          fetchCards = await dbService.getBusinesses();
        }

        setLeads(fetchLeads);
        setCards(fetchCards);
      } catch (err) {
        console.error('Failed to load leads', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // For super admin: fetch leads when a specific business is selected
  useEffect(() => {
    if (!currentUser || currentUser.role === 'business_owner') return;
    
    async function loadLeadsForBusiness() {
      if (selectedCardId === 'all') {
        setLeads([]);
        return;
      }
      try {
        const fetchLeads = await dbService.getLeads(selectedCardId);
        setLeads(fetchLeads);
      } catch (err) {
        console.error('Failed to load leads for business', err);
      }
    }
    loadLeadsForBusiness();
  }, [selectedCardId, currentUser]);

  const handleDelete = async (id: string) => {
    try {
      await dbService.deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete lead record', err);
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = 'Name,Mobile,Email,Message,Business Card,Submission Date\n';
    const rows = filteredLeads.map(lead => {
      const biz = cards.find(c => c.id === lead.businessId);
      const bizName = biz ? biz.businessName : 'Unknown Card';
      
      const escape = (val: string) => `"${val.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      
      return [
        escape(lead.name),
        escape(lead.mobile),
        escape(lead.email),
        escape(lead.message),
        escape(bizName),
        escape(new Date(lead.createdAt).toLocaleString())
      ].join(',');
    }).join('\n');

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vcard_leads_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Search & Filtering Logic
  const filteredLeads = leads.filter(lead => {
    const q = searchQuery.toLowerCase();
    
    // Search filter
    const matchesSearch = 
      lead.name.toLowerCase().includes(q) ||
      lead.mobile.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.message.toLowerCase().includes(q);

    // Business filter
    const matchesCard = selectedCardId === 'all' || lead.businessId === selectedCardId;

    return matchesSearch && matchesCard;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Loading leads database...</span>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.role === 'business_owner';  return (
    <div className="space-y-8">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {isOwner ? 'My Inquiries & Leads' : 'Leads & Inquiries Hub'}
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            {isOwner 
              ? 'View contact requests and feedback submitted specifically for your business profile.'
              : 'Track user submissions, filter inquiries by business, and download reports.'
            }
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredLeads.length === 0}
          className="px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-350 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-40 disabled:scale-100"
        >
          <Download className="w-4 h-4 text-indigo-650" />
          Export CSV Spreadsheet
        </button>
      </div>

      {/* Control Filters panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search - Full width if owner, else 2-column span */}
        <div className={`relative flex items-center ${isOwner ? 'md:col-span-3' : 'md:col-span-2'}`}>
          <Search className="absolute left-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, phone number, or messages..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
          />
        </div>

        {/* Dropdown Card Filter - Hide for Business Owner */}
        {!isOwner && (
          <div className="relative flex items-center">
            <Filter className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={selectedCardId}
              onChange={(e) => setSelectedCardId(e.target.value)}
              className="w-full pl-11 pr-8 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:0.55rem_auto] bg-[position:right_0.75rem_center] bg-no-repeat"
            >
              <option value="all">Show All Business Cards</option>
              {cards.map(biz => (
                <option key={biz.id} value={biz.id}>
                  {biz.businessName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid of Leads */}
      {filteredLeads.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 text-xs font-medium">
          {!isOwner && selectedCardId === 'all'
            ? 'Select a business from the dropdown above to view its leads and enquiries.'
            : searchQuery || selectedCardId !== 'all' 
              ? 'No leads matching the applied search query or dropdown card filters.' 
              : 'No inquiry leads received yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLeads.map((lead) => {
            const business = cards.find(c => c.id === lead.businessId);
            return (
              <div 
                key={lead.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm hover:border-slate-350 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 text-left">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-105 rounded-full text-[10px] font-black text-indigo-700 mb-2 uppercase tracking-wide truncate max-w-full">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      {business?.businessName || 'Business Card'}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 truncate">
                      {lead.name}
                    </h3>
                  </div>
                  
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(lead.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                {/* Message Body */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed text-slate-600 italic text-left">
                  &ldquo;{lead.message}&rdquo;
                </div>

                {/* Contact Footer Links */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-1 text-[11px] text-slate-550 font-semibold text-left">
                    <a href={`tel:${lead.mobile}`} className="flex items-center gap-1.5 hover:text-indigo-700 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {lead.mobile}
                    </a>
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-indigo-700 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {lead.email}
                    </a>
                  </div>

                  {deleteConfirmId === lead.id ? (
                    <div className="flex items-center bg-rose-50 border border-rose-100 p-1.5 rounded-xl gap-2 text-xs">
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        Delete?
                      </span>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="px-2 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-[10px]"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-350 text-slate-700 rounded font-bold text-[10px]"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(lead.id)}
                      className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Lead Record"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
