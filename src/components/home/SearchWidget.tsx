'use client';

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Filter, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SearchWidget() {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searching, setSearching] = useState(false);

  const mockDatabase = [
    { name: 'Heritage Financial Advisors', category: 'Consultant', slug: 'heritage-financial', initial: 'H' },
    { name: 'Dr. Sarah Jenkins Clinic', category: 'Doctor', slug: 'dr-sarah', initial: 'S' },
    { name: 'Aroma Cafe & Restaurant', category: 'Restaurant', slug: 'aroma-cafe', initial: 'A' },
    { name: 'Apex Design Collective', category: 'Freelancer', slug: 'apex-design', initial: 'A' },
    { name: 'Golden Key Real Estate', category: 'Real Estate', slug: 'golden-key', initial: 'G' },
    { name: 'Silk & Silk Retail Boutiques', category: 'Retail Store', slug: 'silk-store', initial: 'S' },
  ];

  // Trigger brief visual search loading spinner
  useEffect(() => {
    if (query || categoryFilter !== 'All') {
      setSearching(true);
      const timer = setTimeout(() => setSearching(false), 300);
      return () => clearTimeout(timer);
    }
  }, [query, categoryFilter]);

  const filteredResults = mockDatabase.filter((item) => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  const categories = ['All', 'Consultant', 'Doctor', 'Restaurant', 'Freelancer', 'Real Estate', 'Retail Store'];

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="text-left border-b border-brown-100 pb-4">
          <span className="text-xs font-black uppercase tracking-widest text-brown-700">Digital Registry</span>
          <h2 className="text-2xl font-extrabold text-stone-900 font-display mt-0.5">Search Business Profiles</h2>
        </div>

        {/* Input Bar & Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex items-center w-full md:flex-1">
            <Search className="absolute left-4 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by business name or keyword..."
              className="w-full pl-11 pr-10 py-3.5 bg-stone-50 border border-brown-200 focus:border-brown-500 focus:outline-none rounded-xl text-xs text-stone-850 placeholder:text-stone-400"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 p-1 hover:bg-stone-200 rounded-full text-stone-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative flex items-center w-full md:w-56">
            <Filter className="absolute left-4 w-4 h-4 text-stone-400 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-brown-200 focus:border-brown-500 focus:outline-none rounded-xl text-xs text-stone-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:0.55rem_auto] bg-[position:right_1rem_center] bg-no-repeat"
            >
              {categories.map((c, i) => (
                <option key={i} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Search Results */}
        {searching ? (
          // Loading spinner
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-brown-700 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Searching records...</span>
          </div>
        ) : filteredResults.length === 0 ? (
          // Empty state
          <div className="p-12 text-center bg-stone-50 border border-brown-100 rounded-2xl text-stone-550 text-xs font-medium">
            No businesses found matching your query details.
          </div>
        ) : (
          // Results list
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 bg-stone-50 border border-brown-100 rounded-xl flex items-center justify-between hover:border-brown-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 text-left">
                  <div className="w-9 h-9 rounded-full bg-brown-100 text-brown-755 border border-brown-200 flex items-center justify-center font-bold text-xs">
                    {item.initial}
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold text-stone-900 truncate">{item.name}</span>
                    <span className="block text-[10px] text-stone-400 font-extrabold uppercase tracking-wide mt-0.5">{item.category}</span>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="p-2 hover:bg-brown-100 rounded-lg text-brown-700 hover:text-brown-755 transition-colors"
                  title="View Profile Details"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
