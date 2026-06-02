'use client';

import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  ChevronRight,
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
      color: 'bg-brown-50 border-brown-200 text-brown-700',
      badgeColor: 'bg-brown-50 text-brown-755 border-brown-200'
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
      color: 'bg-brown-100 border-brown-200 text-brown-900',
      badgeColor: 'bg-brown-100 text-brown-900 border-brown-200'
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
      color: 'bg-stone-50 border-stone-200 text-stone-700',
      badgeColor: 'bg-stone-50 text-stone-700 border-stone-250'
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
      color: 'bg-rose-50 border-rose-150 text-rose-700',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-100'
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
      color: 'bg-amber-50 border-amber-150 text-amber-700',
      badgeColor: 'bg-amber-50 text-amber-750 border-amber-100'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-stone-900 flex items-center gap-3">
          <Layers className="w-8 h-8 text-brown-755" />
          Template Showcase Catalog
        </h1>
        <p className="text-stone-500 text-sm mt-1 font-medium">
          Browse the 5 custom niche templates designed to wow visitors instantly.
        </p>
      </div>

      {/* Grid of Showcase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {templates.map((tpl) => (
          <div 
            key={tpl.id}
            className="bg-white border border-brown-200 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-brown-300 transition-all relative overflow-hidden group shadow-sm"
          >
            <div className="space-y-6">
              {/* Header and Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${tpl.badgeColor}`}>
                  {tpl.id.replace('template', 'Template ')}
                </span>
                
                <span className="text-xs text-stone-400 font-bold flex items-center gap-1">
                  <Layout className="w-3.5 h-3.5" />
                  Niche Optimized
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold tracking-tight text-stone-900 group-hover:text-brown-755 transition-colors">
                  {tpl.name}
                </h3>
                
                <div className="flex items-start gap-2 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-brown-200">
                  <Briefcase className="w-4 h-4 text-brown-755 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <span className="font-bold text-stone-400 block mb-0.5 uppercase tracking-wide text-[9px]">Best Suited Niche:</span>
                    {tpl.suitability}
                  </div>
                </div>
              </div>

              {/* Features checklist */}
              <div className="space-y-3.5 border-t border-brown-100 pt-5">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest block pl-1 text-left">
                  UX Architecture Highlights
                </span>
                <ul className="space-y-2.5">
                  {tpl.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-stone-600 font-semibold leading-relaxed text-left">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom quick details */}
            <div className="mt-8 pt-4 border-t border-brown-100 flex items-center justify-between text-xs font-bold text-stone-500">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Mobile-first responsive
              </span>
              <span className="text-brown-705 font-black flex items-center gap-0.5">
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
