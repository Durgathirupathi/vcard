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
  ExternalLink,
  ShoppingBag,
  MessageCircle
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

export default function Template4({
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
    <div className="min-h-screen bg-rose-50/30 text-rose-950 pb-28 font-sans relative">
      {/* Decorative floral orbs */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Header Banner */}
      <div className="relative h-52 md:h-64 w-full bg-rose-200">
        {card.coverImage ? (
          <img src={card.coverImage} className="w-full h-full object-cover" alt="Store banner" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-rose-700 to-amber-600" />
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 relative">
        {/* Profile Card Overlay */}
        <div className="relative -mt-20 bg-white border border-rose-100 rounded-3xl p-6 shadow-xl shadow-rose-955/5 flex flex-col items-center text-center space-y-3">
          
          {card.profileImage ? (
            <img 
              src={card.profileImage} 
              alt={card.ownerName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md -mt-20 bg-rose-50"
            />
          ) : (
            <div className="w-24 h-24 bg-rose-600 rounded-full flex items-center justify-center font-bold text-3xl text-white border-4 border-white shadow-md -mt-20">
              {card.ownerName.charAt(0)}
            </div>
          )}

          {card.logo && (
            <img src={card.logo} className="h-9 object-contain my-2" alt="Store Logo" />
          )}

          <div>
            <h1 className="text-xl font-extrabold text-rose-950 flex items-center justify-center gap-1.5">
              <ShoppingBag className="w-5 h-5 text-rose-600 flex-shrink-0" />
              {card.businessName}
            </h1>
            <span className="text-[10px] font-bold tracking-widest text-rose-555 uppercase mt-0.5 block">{card.category}</span>
          </div>

          <div className="text-xs text-rose-800 font-semibold bg-rose-50 border border-rose-100/50 px-4 py-1.5 rounded-full">
            Managed by: {card.ownerName} ({card.designation})
          </div>

          {/* Quick CTA Actions Grid */}
          <div className="grid grid-cols-2 gap-2.5 w-full pt-4">
            <a
              href={`tel:${card.mobile}`}
              onClick={() => onActionClick('click_call')}
              className="flex items-center justify-center gap-1.5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Phone className="w-4 h-4" />
              Call Store
            </a>
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              onClick={() => onActionClick('click_whatsapp')}
              className="flex items-center justify-center gap-1.5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
              WhatsApp Us
            </a>
            <button
              onClick={() => {
                onActionClick('click_vcf');
                downloadVCard(card);
              }}
              className="flex items-center justify-center gap-1.5 py-3 bg-rose-950 hover:bg-rose-900 text-white rounded-2xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-rose-300" />
              Save Contact
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 py-3 bg-white border border-rose-200 text-rose-900 rounded-2xl text-xs font-bold transition-all active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-indigo-600" /> : <Share2 className="w-4 h-4 text-rose-400" />}
              {copied ? 'Copied' : 'Share Store'}
            </button>
          </div>
        </div>

        {/* 3. About Business */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md mt-6 space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 border-l-4 border-rose-600 pl-3">
            About Our Store
          </h2>
          <p className="text-xs text-rose-800 leading-relaxed font-medium">
            {card.description || 'Welcome to our premium storefront page. Browse our catalogs and enquiry direct on WhatsApp.'}
          </p>
        </div>

        {/* 4. Product Showcase Catalog Grid with WhatsApp CTA */}
        {services.length > 0 && (
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md mt-6 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 border-l-4 border-rose-600 pl-3">
              Our Products Catalog
            </h2>
            <p className="text-[11px] text-rose-500 -mt-2">Click &quot;Enquire on WhatsApp&quot; on any product card to chat with us directly!</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc) => {
                const waProductUrl = `https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I am interested in your product: *${svc.title}* from your digital card. Please share details and pricing.`)}`;
                return (
                  <div key={svc.id} className="border border-rose-100 rounded-2xl overflow-hidden bg-rose-50/10 hover:border-rose-300 transition-all flex flex-col justify-between shadow-sm">
                    <div>
                      {svc.image && (
                        <div className="h-36 w-full overflow-hidden bg-rose-50 relative">
                          <img 
                            src={svc.image} 
                            alt={svc.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4 space-y-1">
                        <h3 className="text-xs font-extrabold text-rose-950 uppercase tracking-wide truncate">{svc.title}</h3>
                        <p className="text-[11px] text-rose-700 line-clamp-2 leading-relaxed">
                          {svc.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-rose-50/40 border-t border-rose-100">
                      <a
                        href={waProductUrl}
                        target="_blank"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                        Enquire on WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Photos Gallery */}
        {gallery.length > 0 && (
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md mt-6 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 border-l-4 border-rose-600 pl-3">
              Store & Showcase Gallery
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="relative rounded-2xl overflow-hidden aspect-video border border-rose-100 shadow bg-rose-50">
                  <img 
                    src={img.imageUrl} 
                    alt="Store showcase" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Video Walkthroughs */}
        {videos.length > 0 && (
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md mt-6 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 border-l-4 border-rose-600 pl-3">
              Video Walkthroughs
            </h2>
            <div className="space-y-4">
              {videos.map((vid) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = vid.youtubeUrl.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (!videoId) return null;
                return (
                  <div key={vid.id} className="relative w-full rounded-2xl overflow-hidden aspect-video border border-rose-100 shadow">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Client Reviews */}
        {testimonials.length > 0 && (
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md mt-6 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 border-l-4 border-rose-600 pl-3">
              Happy Customer Feedback
            </h2>
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl space-y-3">
                  <div className="flex gap-3 items-center">
                    {t.photo ? (
                      <img src={t.photo} className="w-10 h-10 rounded-full object-cover border border-rose-100 bg-rose-100" alt={t.customerName} />
                    ) : (
                      <div className="w-10 h-10 bg-rose-600 rounded-full flex items-center justify-center font-bold text-sm text-white">
                        {t.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="block text-xs font-bold text-rose-955">{t.customerName}</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-rose-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. QR Code */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md mt-6 flex flex-col items-center text-center space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 border-l-4 border-rose-600 pl-3 self-start text-left">
            Scan & Purchase
          </h2>
          <p className="text-xs text-rose-500 max-w-sm">
            Scan this code to browse our products live on your phone.
          </p>

          <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl min-h-[212px] flex items-center justify-center">
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
              <div className="w-44 h-44 bg-rose-100/30 animate-pulse rounded-2xl flex items-center justify-center text-[9px] text-rose-400 font-bold uppercase tracking-widest border border-rose-100">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full max-w-sm">
            <button
              onClick={() => handleDownloadQR('png')}
              className="flex-1 py-2.5 bg-rose-650 hover:bg-rose-755 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
            >
              Download PNG
            </button>
            <button
              onClick={() => handleDownloadQR('svg')}
              className="flex-1 py-2.5 bg-white border border-rose-200 text-rose-800 text-xs font-bold rounded-xl transition-all active:scale-95"
            >
              Download SVG
            </button>
          </div>
        </div>

        {/* 9. Contact / Lead Form */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md mt-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 border-l-4 border-rose-600 pl-3">
            Contact Store
          </h2>
          <p className="text-xs text-rose-500">
            Submit your contact information and query. We respond instantly.
          </p>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-rose-700 uppercase pl-0.5">Your Name *</label>
              <input
                type="text"
                required
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                placeholder="Rahul Varma"
                className="px-4 py-2.5 bg-rose-50/40 border border-rose-200 focus:bg-white focus:border-rose-600 focus:outline-none rounded-xl text-xs text-rose-900 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-rose-700 uppercase pl-0.5">Mobile Number *</label>
              <input
                type="tel"
                required
                value={leadForm.mobile}
                onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                placeholder="99999 11111"
                className="px-4 py-2.5 bg-rose-50/40 border border-rose-200 focus:bg-white focus:border-rose-600 focus:outline-none rounded-xl text-xs text-rose-900 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-rose-700 uppercase pl-0.5">Email Address</label>
              <input
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                placeholder="rahul@gmail.com"
                className="px-4 py-2.5 bg-rose-50/40 border border-rose-200 focus:bg-white focus:border-rose-600 focus:outline-none rounded-xl text-xs text-rose-900 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-rose-700 uppercase pl-0.5">Inquiry Details *</label>
              <textarea
                rows={3}
                required
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                placeholder="Details of pure silk sarees or retail purchase orders you want..."
                className="px-4 py-2.5 bg-rose-50/40 border border-rose-200 focus:bg-white focus:border-rose-600 focus:outline-none rounded-xl text-xs text-rose-900 transition-colors resize-none"
              />
            </div>

            {success && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold text-center">
                Store enquiry submitted! We will call/WhatsApp you back shortly.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              {submitting ? 'Sending Request...' : 'Send Enquiry Request'}
            </button>
          </form>
        </div>

        {/* 10. Contact Details list */}
        <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-md mt-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-rose-900 border-l-4 border-rose-600 pl-3">
            Store Location & Contact
          </h2>
          <div className="space-y-4 text-xs text-rose-800">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-rose-950">Store Hotlines</span>
                <span className="block mt-0.5 text-rose-700">{card.mobile}</span>
                {card.alternateMobile && <span className="block text-rose-500 mt-0.5">{card.alternateMobile}</span>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-rose-955">Store Support Email</span>
                <span className="block mt-0.5 text-rose-750">{card.email}</span>
              </div>
            </div>

            {card.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-rose-955">Store Address</span>
                  <span className="block mt-0.5 leading-relaxed text-rose-700">{card.address}</span>
                  {card.mapsLink && (
                    <a href={card.mapsLink} target="_blank" className="inline-flex items-center gap-1 text-[10px] text-rose-650 font-bold mt-1.5 hover:underline uppercase tracking-wider">
                      Launch Navigation Maps
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {card.website && (
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-rose-955">Store E-Commerce</span>
                  <a href={card.website} target="_blank" className="text-rose-600 hover:underline inline-flex items-center gap-1 mt-0.5 font-bold">
                    {card.website}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 11. Social media list */}
        <div className="flex items-center justify-center flex-wrap gap-3.5 mt-8">
          {card.facebookUrl && <a href={card.facebookUrl} target="_blank" className="p-3 bg-white border border-rose-100 rounded-full hover:bg-rose-100 hover:text-blue-600 text-slate-500 shadow-sm transition-all"><FacebookIcon /></a>}
          {card.instagramUrl && <a href={card.instagramUrl} target="_blank" className="p-3 bg-white border border-rose-100 rounded-full hover:bg-rose-100 hover:text-pink-650 text-slate-500 shadow-sm transition-all"><InstagramIcon /></a>}
          {card.linkedinUrl && <a href={card.linkedinUrl} target="_blank" className="p-3 bg-white border border-rose-100 rounded-full hover:bg-rose-100 hover:text-blue-500 text-slate-500 shadow-sm transition-all"><LinkedinIcon /></a>}
        </div>
      </div>

      {/* ==================================================== */}
      {/* FLOATING ACTION BOTTOM STICKY CONTACT BAR */}
      {/* ==================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-100 py-3 px-4 shadow-xl shadow-rose-900/10 flex items-center justify-between max-w-xl mx-auto rounded-t-3xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Enquire Now</span>
          <span className="text-xs font-bold text-rose-950 truncate max-w-[150px]">{card.businessName}</span>
        </div>

        <div className="flex gap-2">
          <a
            href={`tel:${card.mobile}`}
            onClick={() => onActionClick('click_call')}
            className="p-2.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
            title="Call"
          >
            <Phone className="w-5 h-5 animate-pulse" />
          </a>
          <a
            href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            onClick={() => onActionClick('click_whatsapp')}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-white text-emerald-600" />
            WhatsApp CTA
          </a>
        </div>
      </div>
    </div>
  );
}
