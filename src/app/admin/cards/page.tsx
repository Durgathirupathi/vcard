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
          <div className="w-10 h-10 border-4 border-brown-700 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-brown-900 uppercase tracking-widest">Loading cards archive...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Top Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-stone-900">
            Manage Business Cards
          </h1>
          <p className="text-stone-500 text-sm mt-1 font-medium">
            Create, edit, and audit active digital identity cards.
          </p>
        </div>
        <Link
          href="/admin/cards/new"
          className="px-5 py-3 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          Create Business Card
        </Link>
      </div>

      {/* Live Search Bar */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by business name, owner name, category, or mobile number..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-brown-200 focus:border-brown-500 focus:outline-none rounded-xl text-xs transition-all text-stone-800 placeholder:text-stone-400 shadow-sm"
        />
      </div>

      {/* Grid of Business Cards */}
      {filteredCards.length === 0 ? (
        <div className="p-12 text-center bg-white border border-brown-200 rounded-2xl text-stone-500 text-xs font-medium">
          {searchQuery ? 'No matching business cards found for your search query.' : 'No business cards registered yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div 
              key={card.id}
              className="group relative bg-white border border-brown-200 rounded-2xl overflow-hidden shadow-sm hover:border-brown-300 transition-all flex flex-col justify-between"
            >
              {/* Cover Image banner placeholder/actual */}
              <div className="h-32 w-full overflow-hidden relative border-b border-brown-100 bg-stone-50">
                {card.coverImage ? (
                  <img 
                    src={card.coverImage} 
                    alt={card.businessName}
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-stone-100" />
                )}
                
                {/* Template badge overlay */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-brown-50 border border-brown-200 rounded-full text-[10px] text-brown-755 font-black uppercase tracking-wider">
                  {card.templateId.replace('template', 'Template ')}
                </div>
              </div>

              {/* Profile Image avatar overlap */}
              <div className="px-6 -mt-8 relative z-10 flex items-end justify-between">
                {card.profileImage ? (
                  <img 
                    src={card.profileImage} 
                    alt={card.ownerName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow bg-white p-0.5"
                  />
                ) : (
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center font-bold text-xl text-brown-755 border-2 border-white shadow">
                    {card.ownerName.charAt(0)}
                  </div>
                )}
                
                {/* Link to public view */}
                <Link
                  href={`/${card.slug}`}
                  target="_blank"
                  className="px-3 py-1.5 bg-stone-50 border border-brown-200 hover:border-brown-300 text-stone-700 hover:text-stone-900 rounded-lg transition-all text-xs font-bold flex items-center gap-1.5"
                  title="View Public Page"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live View
                </Link>
              </div>

              {/* Business details */}
              <div className="p-6 space-y-4 flex-1">
                <div>
                  <h3 className="text-sm font-bold text-stone-950 truncate group-hover:text-brown-755 transition-colors">
                    {card.businessName}
                  </h3>
                  <span className="text-[10px] text-brown-755 font-bold block mt-0.5 truncate uppercase tracking-wider">
                    {card.category}
                  </span>
                </div>

                <div className="space-y-2 border-t border-brown-100 pt-4 text-xs text-stone-600 font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-stone-400" />
                    <span className="truncate">{card.ownerName} ({card.designation})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <span>{card.mobile}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-stone-400" />
                    <span className="truncate">/{card.slug}</span>
                  </div>
                </div>
              </div>

              {/* Control Action Buttons */}
              <div className="px-6 py-4 bg-stone-50 border-t border-brown-100 flex items-center justify-between gap-4">
                {deleteConfirmId === card.id ? (
                  <div className="w-full flex items-center justify-between bg-rose-50 border border-rose-100 p-2 rounded-xl gap-2 text-xs">
                    <span className="text-rose-700 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      Delete?
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px]"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg font-bold text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setDeleteConfirmId(card.id)}
                      className="p-2 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                    <Link
                      href={`/admin/cards/edit/${card.id}`}
                      className="px-3 py-1.5 bg-brown-700 hover:bg-brown-755 text-white rounded-lg text-xs font-black transition-colors flex items-center gap-1.5"
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
