'use client';

import React, { useState, useEffect } from 'react';
import { BusinessCard, Service, GalleryImage, Video, Testimonial } from '../../types';
import { downloadVCard } from '../../lib/vcard';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Share2, 
  UserPlus, 
  MessageSquare, 
  Star, 
  Check, 
  ExternalLink
} from 'lucide-react';

// Custom Brand SVGs
const FacebookIcon = () => (
  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);


interface TemplateProps {
  card: BusinessCard;
  services: Service[];
  gallery: GalleryImage[];
  videos: Video[];
  testimonials: Testimonial[];
  onSubmitLead: (lead: { name: string; mobile: string; email: string; message: string }) => Promise<void>;
  onActionClick: (type: 'click_call' | 'click_whatsapp' | 'click_vcf') => void;
}

export default function Template5({
  card,
  services,
  gallery,
  videos,
  testimonials,
  onSubmitLead,
  onActionClick
}: TemplateProps) {
  const [leadForm, setLeadForm] = useState({ name: '', mobile: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `/${card.slug}`;

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.mobile || !leadForm.message) return;
    setSubmitting(true);
    try {
      await onSubmitLead(leadForm);
      setSuccess(true);
      setLeadForm({ name: '', mobile: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = (format: 'png' | 'svg') => {
    const svgElement = document.getElementById('card-qr-code');
    if (!svgElement) return;

    if (format === 'svg') {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `${card.slug}-qrcode.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 300, 300);
          ctx.drawImage(img, 0, 0, 300, 300);
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `${card.slug}-qrcode.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      };
      img.src = svgUrl;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 pb-20 font-serif relative">
      {/* Decorative Gold Radial Mesh */}
      <div className="absolute top-0 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_top,#1f1a10,transparent_60%)] pointer-events-none" />

      {/* 1. Header Cover Picture */}
      <div className="relative h-60 md:h-72 w-full bg-neutral-900 border-b border-[#C5A880]/20">
        {card.coverImage ? (
          <img src={card.coverImage} className="w-full h-full object-cover opacity-60" alt="Luxury banner" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950" />
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 relative z-10">
        {/* Profile Card Overlay (Gold accent layout) */}
        <div className="relative -mt-24 bg-neutral-900 border border-[#C5A880]/30 rounded-none p-8 shadow-2xl flex flex-col items-center text-center space-y-4">
          
          {card.profileImage ? (
            <img 
              src={card.profileImage} 
              alt={card.ownerName}
              className="w-26 h-26 rounded-none object-cover border border-[#C5A880]/40 -mt-20 bg-neutral-950 p-1"
            />
          ) : (
            <div className="w-26 h-26 bg-neutral-950 text-[#C5A880] rounded-none flex items-center justify-center font-bold text-3xl border border-[#C5A880]/40 -mt-20">
              {card.ownerName.charAt(0)}
            </div>
          )}

          {card.logo && (
            <img src={card.logo} className="h-7 object-contain my-2 opacity-80" alt="Logo" />
          )}

          <div className="space-y-1.5">
            <h1 className="text-2xl font-normal tracking-wide text-white uppercase">{card.businessName}</h1>
            <span className="text-[9px] font-bold tracking-widest text-[#C5A880] uppercase block">{card.category}</span>
          </div>

          <div className="border-t border-b border-[#C5A880]/15 py-3 w-full text-xs font-bold text-white uppercase tracking-widest">
            {card.ownerName} <span className="text-neutral-500 font-normal px-1">|</span> <span className="text-[#C5A880] font-normal">{card.designation}</span>
          </div>

          {/* Quick CTA Actions Grid */}
          <div className="grid grid-cols-2 gap-3 w-full pt-2">
            <a
              href={`tel:${card.mobile}`}
              onClick={() => onActionClick('click_call')}
              className="flex items-center justify-center gap-1.5 py-3 bg-[#C5A880] hover:bg-[#B39670] text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#C5A880]/10"
            >
              <Phone className="w-4 h-4" />
              Call Elite
            </a>
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              onClick={() => onActionClick('click_whatsapp')}
              className="flex items-center justify-center gap-1.5 py-3 bg-white hover:bg-neutral-100 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
            <button
              onClick={() => {
                onActionClick('click_vcf');
                downloadVCard(card);
              }}
              className="flex items-center justify-center gap-1.5 py-3 bg-transparent border border-[#C5A880]/40 hover:bg-[#C5A880]/10 text-white text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <UserPlus className="w-4 h-4 text-[#C5A880]" />
              Save Details
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 py-3 bg-transparent border border-neutral-800 hover:bg-neutral-900 text-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-[#C5A880]" /> : <Share2 className="w-4 h-4 text-neutral-500" />}
              {copied ? 'Copied' : 'Share Link'}
            </button>
          </div>
        </div>

        {/* 3. About Business */}
        <div className="bg-neutral-900 border border-[#C5A880]/20 rounded-none p-7 shadow-xl mt-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] border-b border-neutral-800 pb-2.5">
            Branding Dossier
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            {card.description || 'Welcome to our premium luxury showcase. Review high-end service offerings, browse portfolios, and register direct requests.'}
          </p>
        </div>

        {/* 4. Luxury Services Grid */}
        {services.length > 0 && (
          <div className="bg-neutral-900 border border-[#C5A880]/20 rounded-none p-7 shadow-xl mt-6 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] border-b border-neutral-800 pb-2.5">
              Bespoke Services
            </h2>
            <div className="space-y-4 divide-y divide-neutral-850">
              {services.map((svc, i) => (
                <div key={svc.id} className={`flex flex-col gap-3 ${i > 0 ? 'pt-4' : ''}`}>
                  {svc.image && (
                    <img 
                      src={svc.image} 
                      alt={svc.title}
                      className="w-full h-40 object-cover border border-neutral-800 grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  )}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">{svc.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      {svc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Image Showcase Gallery */}
        {gallery.length > 0 && (
          <div className="bg-neutral-900 border border-[#C5A880]/20 rounded-none p-7 shadow-xl mt-6 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] border-b border-neutral-800 pb-2.5">
              Portfolio Gallery
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative border border-neutral-800 bg-neutral-950 aspect-video group overflow-hidden">
                  <img 
                    src={img.imageUrl} 
                    alt="Showcase asset" 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 border border-transparent group-hover:border-[#C5A880]/30 transition-all duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Videos Showcase */}
        {videos.length > 0 && (
          <div className="bg-neutral-900 border border-[#C5A880]/20 rounded-none p-7 shadow-xl mt-6 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] border-b border-neutral-800 pb-2.5">
              Media Showcases
            </h2>
            <div className="space-y-4">
              {videos.map((vid) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = vid.youtubeUrl.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (!videoId) return null;
                return (
                  <div key={vid.id} className="relative w-full rounded-none overflow-hidden aspect-video border border-neutral-800 bg-neutral-950">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Client Testimonials */}
        {testimonials.length > 0 && (
          <div className="bg-neutral-900 border border-[#C5A880]/20 rounded-none p-7 shadow-xl mt-6 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] border-b border-neutral-800 pb-2.5">
              Acclamations & Letters
            </h2>
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 bg-neutral-950 border border-neutral-850 rounded-none space-y-3 relative overflow-hidden group">
                  <div className="flex gap-3.5 items-center">
                    {t.photo ? (
                      <img src={t.photo} className="w-9 h-9 rounded-none object-cover border border-[#C5A880]/25 bg-neutral-900" alt={t.customerName} />
                    ) : (
                      <div className="w-9 h-9 bg-neutral-900 border border-neutral-800 text-[#C5A880] font-bold flex items-center justify-center text-xs">
                        {t.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="block text-xs font-bold text-white uppercase tracking-wider">{t.customerName}</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-[#C5A880] text-[#C5A880]' : 'text-neutral-800'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed italic border-t border-neutral-850 pt-2">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. QR Code Section */}
        <div className="bg-neutral-900 border border-[#C5A880]/20 rounded-none p-7 shadow-xl mt-6 flex flex-col items-center text-center space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] border-b border-neutral-800 pb-2.5 self-start text-left">
            Dynamic QR Vault
          </h2>
          <p className="text-xs text-neutral-400 max-w-sm font-light">
            Scan this dynamic emblem from any phone camera to access this digital card live.
          </p>

          <div className="p-3 bg-white border border-[#C5A880]/40 rounded-none min-h-[206px] flex items-center justify-center">
            {mounted ? (
              <QRCodeSVG
                id="card-qr-code"
                value={shareUrl}
                size={180}
                level="H"
                includeMargin={true}
                className="w-44 h-44"
              />
            ) : (
              <div className="w-44 h-44 bg-neutral-900 animate-pulse rounded-none flex items-center justify-center text-[9px] text-[#C5A880] font-bold uppercase tracking-widest border border-[#C5A880]/20">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={() => handleDownloadQR('png')}
              className="flex-1 py-2.5 bg-[#C5A880] hover:bg-[#B39670] text-neutral-950 text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
            >
              PNG
            </button>
            <button
              onClick={() => handleDownloadQR('svg')}
              className="flex-1 py-2.5 bg-transparent border border-neutral-800 text-neutral-300 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 transition-colors rounded-none"
            >
              SVG
            </button>
          </div>
        </div>

        {/* 9. Contact / Lead Form */}
        <div className="bg-neutral-900 border border-[#C5A880]/20 rounded-none p-7 shadow-xl mt-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] border-b border-neutral-800 pb-2.5">
            Register Private Enquiry
          </h2>
          <p className="text-xs text-neutral-400">
            Submit your private request. All submissions are treated with total discretion.
          </p>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest pl-0.5">Your Name *</label>
              <input
                type="text"
                required
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                placeholder="Rahul Varma"
                className="px-3 py-2.5 bg-neutral-950 border border-neutral-850 focus:border-[#C5A880] focus:outline-none rounded-none text-xs text-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest pl-0.5">Mobile Number *</label>
              <input
                type="tel"
                required
                value={leadForm.mobile}
                onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                placeholder="99999 11111"
                className="px-3 py-2.5 bg-neutral-950 border border-neutral-850 focus:border-[#C5A880] focus:outline-none rounded-none text-xs text-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest pl-0.5">Email Address</label>
              <input
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                placeholder="rahul@gmail.com"
                className="px-3 py-2.5 bg-neutral-950 border border-neutral-850 focus:border-[#C5A880] focus:outline-none rounded-none text-xs text-white transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest pl-0.5">Discretionary Enquiry *</label>
              <textarea
                rows={3}
                required
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                placeholder="Write specific details of property acquisitions, or luxury advisors requests..."
                className="px-3 py-2.5 bg-neutral-950 border border-neutral-850 focus:border-[#C5A880] focus:outline-none rounded-none text-xs text-white transition-colors resize-none"
              />
            </div>

            {success && (
              <div className="p-3.5 bg-neutral-950 border border-emerald-900/40 rounded-none text-emerald-400 text-xs font-bold text-center">
                Enquiry registered. A Senior Relationship Partner will contact you shortly.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#C5A880] hover:bg-[#B39670] text-neutral-950 text-xs font-bold uppercase tracking-widest transition-colors rounded-none"
            >
              {submitting ? 'Registering Request...' : 'Submit Private Request'}
            </button>
          </form>
        </div>

        {/* 10. Contact Details list */}
        <div className="bg-neutral-900 border border-[#C5A880]/20 rounded-none p-7 shadow-xl mt-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#C5A880] border-b border-neutral-800 pb-2.5">
            Corporate Offices
          </h2>
          <div className="space-y-4 text-xs font-light text-neutral-400">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[#C5A880] mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-white uppercase tracking-widest text-[9px]">Private Hotlines</span>
                <span className="block mt-1">{card.mobile}</span>
                {card.alternateMobile && <span className="block text-neutral-600 mt-0.5">{card.alternateMobile}</span>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#C5A880] mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-white uppercase tracking-widest text-[9px]">Discreet Correspondence</span>
                <span className="block mt-1">{card.email}</span>
              </div>
            </div>

            {card.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-white uppercase tracking-widest text-[9px]">Office Address</span>
                  <span className="block mt-1 leading-relaxed">{card.address}</span>
                  {card.mapsLink && (
                    <a href={card.mapsLink} target="_blank" className="inline-flex items-center gap-1 text-[9px] text-[#C5A880] font-bold mt-1.5 hover:underline uppercase tracking-widest">
                      Launch Navigator
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {card.website && (
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#C5A880] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-white uppercase tracking-widest text-[9px]">Private Domain</span>
                  <a href={card.website} target="_blank" className="text-[#C5A880] hover:underline inline-flex items-center gap-1 mt-1 font-bold">
                    {card.website}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 11. Social media list */}
        <div className="flex items-center justify-center flex-wrap gap-4 mt-8">
          {card.facebookUrl && <a href={card.facebookUrl} target="_blank" className="p-3 bg-neutral-900 border border-neutral-800 rounded-none hover:border-[#C5A880]/40 text-[#C5A880] shadow-sm transition-all"><FacebookIcon /></a>}
          {card.instagramUrl && <a href={card.instagramUrl} target="_blank" className="p-3 bg-neutral-900 border border-neutral-800 rounded-none hover:border-[#C5A880]/40 text-[#C5A880] shadow-sm transition-all"><InstagramIcon /></a>}
          {card.linkedinUrl && <a href={card.linkedinUrl} target="_blank" className="p-3 bg-neutral-900 border border-neutral-800 rounded-none hover:border-[#C5A880]/40 text-[#C5A880] shadow-sm transition-all"><LinkedinIcon /></a>}
        </div>

        {/* Footer info brand */}
        <div className="text-center text-neutral-600 text-[9px] mt-10 font-bold uppercase tracking-widest">
          Elite Coterie by VCard Studio
        </div>
      </div>
    </div>
  );
}
