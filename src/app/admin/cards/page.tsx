'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dbService } from '../../../lib/firestore';
import { BusinessCard } from '../../../types';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  AlertTriangle,
  Tag,
  User,
  Phone,
  LayoutGrid
} from 'lucide-react';

export default function CardsListPage() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCards() {
      try {
        const fetchCards = await dbService.getBusinesses();
        setCards(fetchCards);
      } catch (err) {
        console.error('Failed to load business cards', err);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await dbService.deleteBusiness(id);
      setCards(cards.filter(c => c.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete card', err);
    }
  };

  // Search Logic (matches Business Name, Mobile Number, Category, or Owner Name)
  const filteredCards = cards.filter(card => {
    const q = searchQuery.toLowerCase();
    return (
      card.businessName.toLowerCase().includes(q) ||
      card.ownerName.toLowerCase().includes(q) ||
      card.category.toLowerCase().includes(q) ||
      card.mobile.toLowerCase().includes(q) ||
      (card.alternateMobile && card.alternateMobile.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Loading cards archive...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Top Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Manage Business Cards
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, edit, and audit active digital identity cards.
          </p>
        </div>
        <Link
          href="/admin/cards/new"
          className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-950/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Create Business Card
        </Link>
      </div>

      {/* Live Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by business name, owner name, category, or mobile number..."
          className="w-full pl-12 pr-4 py-3.5 bg-slate-900/40 border border-slate-800 focus:border-indigo-500 focus:outline-none rounded-xl text-sm transition-all text-slate-200 placeholder:text-slate-555 shadow-inner"
        />
      </div>

      {/* Grid of Business Cards */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/20 border border-slate-850 rounded-2xl text-slate-500 text-sm">
          {searchQuery ? 'No matching business cards found for your search query.' : 'No business cards registered yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div 
              key={card.id}
              className="group relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700/60 transition-all flex flex-col justify-between"
            >
              {/* Cover Image banner placeholder/actual */}
              <div className="h-32 w-full overflow-hidden relative border-b border-slate-800/50 bg-slate-950">
                {card.coverImage ? (
                  <img 
                    src={card.coverImage} 
                    alt={card.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-indigo-950 to-purple-950" />
                )}
                
                {/* Template badge overlay */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-full text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  {card.templateId.replace('template', 'Template ')}
                </div>
              </div>

              {/* Profile Image avatar overlap */}
              <div className="px-6 -mt-8 relative z-10 flex items-end justify-between">
                {card.profileImage ? (
                  <img 
                    src={card.profileImage} 
                    alt={card.ownerName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-900 shadow-md bg-slate-850"
                  />
                ) : (
                  <div className="w-16 h-16 bg-slate-850 rounded-full flex items-center justify-center font-bold text-xl text-indigo-400 border-2 border-slate-900 shadow-md">
                    {card.ownerName.charAt(0)}
                  </div>
                )}
                
                {/* Link to public view */}
                <Link
                  href={`/${card.slug}`}
                  target="_blank"
                  className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all shadow-md flex items-center gap-1.5 text-xs font-bold"
                  title="View Public Page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live View
                </Link>
              </div>

              {/* Business details */}
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 truncate group-hover:text-indigo-400 transition-colors">
                    {card.businessName}
                  </h3>
                  <span className="text-xs text-indigo-400 font-semibold block mt-0.5 truncate uppercase tracking-wide">
                    {card.category}
                  </span>
                </div>

                <div className="space-y-2 border-t border-slate-850 pt-4 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="font-medium truncate">{card.ownerName} ({card.designation})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{card.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-slate-500" />
                    <span className="truncate">/{card.slug}</span>
                  </div>
                </div>
              </div>

              {/* Control Action Buttons */}
              <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-850 flex items-center justify-between gap-4">
                {deleteConfirmId === card.id ? (
                  <div className="w-full flex items-center justify-between bg-red-950/20 border border-red-900/30 p-2 rounded-xl gap-2 text-xs">
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      Delete?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setDeleteConfirmId(card.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <Link
                      href={`/admin/cards/edit/${card.id}`}
                      className="py-2 px-4 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/20 hover:border-indigo-500 text-indigo-400 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit VCard
                    </Link>
                  </>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
