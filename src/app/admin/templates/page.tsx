'use client';

import React from 'react';
import { 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Layout,
  Briefcase
} from 'lucide-react';

export default function TemplatesShowcasePage() {
  const templates = [
    {
      id: 'template1',
      name: 'Classic Professional',
      suitability: 'Consultants, Doctors, Insurance Agents, Advocates',
      features: [
        'Light, clean, high-contrast structural grid layout',
        'Call-to-actions (Call, WhatsApp, VCF) placed at the immediate top',
        'Elegant Serif typography for titles, crisp sans-serif content',
        'Optimized for rapid one-click call interactions'
      ],
      color: 'bg-indigo-600/10 border-indigo-500/20 text-indigo-400',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 'template2',
      name: 'Modern Business',
      suitability: 'Agencies, IT Developers, Startups, SaaS Companies',
      features: [
        'Stunning dark-mode dashboard panels with backdrop blur',
        'Vibrant glowing violet-to-indigo gradient radial meshes',
        'Sleek glassmorphic service grids and chips accents',
        'Dynamic social media top-bar navigation integrations'
      ],
      color: 'bg-purple-600/10 border-purple-500/20 text-purple-400',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      id: 'template3',
      name: 'Portfolio Design',
      suitability: 'Designers, Freelance Artists, Architects, Photographers',
      features: [
        'Minimalist art-gallery inspired styling (white background)',
        'Thin black and gray structural grids with high-end margins',
        'Large, image-focused masonry project portfolio showcases',
        'Clean grayscale image transitions and high-contrast typography'
      ],
      color: 'bg-slate-300/30 border-slate-500/20 text-slate-200',
      badgeColor: 'bg-slate-800/80 text-slate-300 border-slate-700/50'
    },
    {
      id: 'template4',
      name: 'Store Layout',
      suitability: 'Bridal Saree Shops, Gift Shops, Retailers, Boutiques',
      features: [
        'Bright retail-friendly warm silk-rose color aesthetics',
        'Products catalogs displaying individual WhatsApp Query CTAs',
        'Floating bottom sticky Call & WhatsApp actions for quick chat',
        'Promotional visual slider showcase grids'
      ],
      color: 'bg-rose-650/10 border-rose-500/20 text-rose-455',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'template5',
      name: 'Premium Luxury',
      suitability: 'Real Estate Brokers, Luxury Brands, Premium Concierges',
      features: [
        'Deep elegant onyx black backgrounds with golden mesh headers',
        'Delicate polished gold borders (#C5A880) and typography styling',
        'Cormorant Garamond / Playfair Display ultra-premium serif font arrays',
        'Refined acclamations and testimonials luxury quotes blocks'
      ],
      color: 'bg-amber-650/10 border-amber-500/20 text-amber-400',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <Layers className="w-8 h-8 text-indigo-400 animate-pulse" />
          Template Showcase Catalog
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Browse the 5 custom niche templates designed to wow visitors instantly.
        </p>
      </div>

      {/* Grid of Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {templates.map((tpl, idx) => (
          <div 
            key={tpl.id}
            className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-slate-700/60 transition-all relative overflow-hidden group shadow-lg"
          >
            {/* Index Glow Tag */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-all" />
            
            <div className="space-y-6">
              {/* Header and Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${tpl.badgeColor}`}>
                  {tpl.id.replace('template', 'Template ')}
                </span>
                
                <span className="text-xs text-slate-500 font-semibold italic flex items-center gap-1">
                  <Layout className="w-3.5 h-3.5" />
                  Niche Optimized
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  {tpl.name}
                </h3>
                
                <div className="flex items-start gap-2 text-xs text-slate-350 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                  <Briefcase className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-400 block mb-0.5 uppercase tracking-wide text-[10px]">Best Suited Niche:</span>
                    {tpl.suitability}
                  </div>
                </div>
              </div>

              {/* Features checklist */}
              <div className="space-y-3.5 border-t border-slate-850 pt-5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block pl-1">
                  UX Architecture Highlights
                </span>
                <ul className="space-y-2.5">
                  {tpl.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-400 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom quick details */}
            <div className="mt-8 pt-4 border-t border-slate-850 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Mobile-first responsive
              </span>
              <span className="text-indigo-400 font-bold flex items-center gap-0.5">
                Use in form
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
