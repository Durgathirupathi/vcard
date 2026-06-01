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
  ChevronRight,
  Sparkles
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

const YoutubeIcon = () => (
  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.163c-.272-.997-1.04-1.781-2.016-2.056-1.782-.48-8.982-.48-8.982-.48s-7.2.001-8.982.48c-.976.275-1.744 1.059-2.016 2.056-.479 1.787-.479 5.52-.479 5.52s-.001 3.733.479 5.52c.272.997 1.04 1.781 2.016 2.056 1.782.48 8.982.48 8.982.48s7.201-.001 8.982-.48c.976-.275 1.744-1.059 2.016-2.056.479-1.787.479-5.52.479-5.52s.001-3.733-.479-5.52zM9.545 15.568V8.113l6.452 3.728-6.452 3.727z"/>
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

export default function Template2({
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans relative overflow-hidden">
      {/* Glow Orbs background */}
      <div className="absolute top-[-5%] right-[-10%] w-[50%] h-[30%] bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] left-[-10%] w-[50%] h-[30%] bg-purple-600/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* 1. Large Cover Banner */}
      <div className="relative h-56 md:h-72 w-full bg-slate-900 border-b border-indigo-900/20">
        {card.coverImage ? (
          <img src={card.coverImage} className="w-full h-full object-cover opacity-80" alt="Business banner" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950" />
        )}
        
        {/* Glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="max-w-xl mx-auto px-4 relative z-10">
        
        {/* Profile Info Overlay (Glassmorphism card) */}
        <div className="relative -mt-24 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
          {/* Avatar overlap */}
          {card.profileImage ? (
            <img 
              src={card.profileImage} 
              alt={card.ownerName}
              className="w-28 h-28 rounded-3xl object-cover border-2 border-indigo-500 shadow-xl shadow-indigo-950/20 -mt-20 bg-slate-850"
            />
          ) : (
            <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center font-bold text-4xl text-white border-2 border-indigo-500 shadow-xl -mt-20">
              {card.ownerName.charAt(0)}
            </div>
          )}

          {card.logo && (
            <img src={card.logo} className="h-8 object-contain my-3 opacity-90 filter invert" alt="Logo" />
          )}

          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent mt-2 tracking-tight">
            {card.businessName}
          </h1>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs text-indigo-400 mt-2 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {card.category}
          </div>
          
          <div className="mt-4">
            <span className="text-sm font-extrabold text-slate-200">{card.ownerName}</span>
            <span className="text-xs text-slate-500 block font-semibold mt-0.5">{card.designation}</span>
          </div>

          {/* Social icons top-level quick grid */}
          <div className="flex items-center justify-center gap-3.5 mt-5">
            {card.facebookUrl && <a href={card.facebookUrl} target="_blank" className="p-2.5 bg-slate-950/50 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-400 transition-colors border border-slate-850"><FacebookIcon /></a>}
            {card.instagramUrl && <a href={card.instagramUrl} target="_blank" className="p-2.5 bg-slate-950/50 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-400 transition-colors border border-slate-850"><InstagramIcon /></a>}
            {card.linkedinUrl && <a href={card.linkedinUrl} target="_blank" className="p-2.5 bg-slate-950/50 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-400 transition-colors border border-slate-850"><LinkedinIcon /></a>}
            {card.youtubeUrl && <a href={card.youtubeUrl} target="_blank" className="p-2.5 bg-slate-950/50 hover:bg-indigo-600 hover:text-white rounded-xl text-slate-400 transition-colors border border-slate-850"><YoutubeIcon /></a>}
          </div>
        </div>

        {/* 2. Primary CTAs Box */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <a
            href={`tel:${card.mobile}`}
            onClick={() => onActionClick('click_call')}
            className="flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-indigo-950/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Phone className="w-4.5 h-4.5" />
            Connect Call
          </a>
          <a
            href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
            target="_blank"
            onClick={() => onActionClick('click_whatsapp')}
            className="flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-950/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <MessageSquare className="w-4.5 h-4.5 fill-white text-emerald-600" />
            WhatsApp CTA
          </a>
          <button
            onClick={() => {
              onActionClick('click_vcf');
              downloadVCard(card);
            }}
            className="flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-2xl text-xs font-extrabold border border-slate-800 transition-all hover:scale-[1.02] active:scale-95"
          >
            <UserPlus className="w-4.5 h-4.5 text-indigo-400" />
            Save Contact
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 py-3.5 bg-slate-900/40 hover:bg-slate-900 border border-slate-800/80 text-slate-300 rounded-2xl text-xs font-extrabold transition-all hover:scale-[1.02] active:scale-95"
          >
            {copied ? <Check className="w-4.5 h-4.5 text-emerald-400" /> : <Share2 className="w-4.5 h-4.5 text-slate-400" />}
            {copied ? 'Link Copied!' : 'Share Page'}
          </button>
        </div>

        {/* 3. About Business */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 shadow-xl mt-6 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest pl-2">
            Overview Profile
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed pl-2">
            {card.description || 'Welcome to our modern digital card showcase profile page. Read through our product catalog services, and launch enquiries.'}
          </p>
        </div>

        {/* 4. Services Grid (Modern glassmorphic grid cards) */}
        {services.length > 0 && (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 shadow-xl mt-6 space-y-5">
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">
              Services Portfolio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((svc) => (
                <div key={svc.id} className="p-4 bg-slate-950/60 border border-slate-850 hover:border-slate-800 rounded-2xl space-y-3 group transition-all shadow-lg hover:-translate-y-1">
                  {svc.image && (
                    <img 
                      src={svc.image} 
                      alt={svc.title}
                      className="w-full h-28 object-cover rounded-xl border border-slate-900"
                    />
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{svc.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
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
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 shadow-xl mt-6 space-y-5">
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">
              Products Showcase Gallery
            </h2>
            <div className="grid grid-cols-2 gap-3.5">
              {gallery.map((img) => (
                <div key={img.id} className="relative rounded-2xl overflow-hidden aspect-video border border-slate-850 shadow bg-slate-900 group">
                  <img 
                    src={img.imageUrl} 
                    alt="Showcase" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Videos Showcase */}
        {videos.length > 0 && (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 shadow-xl mt-6 space-y-5">
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">
              Video Testimonials
            </h2>
            <div className="space-y-4">
              {videos.map((vid) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = vid.youtubeUrl.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (!videoId) return null;
                return (
                  <div key={vid.id} className="relative w-full rounded-2xl overflow-hidden aspect-video border border-slate-850 shadow">
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

        {/* 7. Customer Testimonials */}
        {testimonials.length > 0 && (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 shadow-xl mt-6 space-y-5">
            <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">
              Client Feedback
            </h2>
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl space-y-3 shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-all" />
                  
                  <div className="flex gap-3 items-center">
                    {t.photo ? (
                      <img src={t.photo} className="w-10 h-10 rounded-full object-cover border border-slate-800 bg-slate-800" alt={t.customerName} />
                    ) : (
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm text-slate-100">
                        {t.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="block text-xs font-bold text-slate-200">{t.customerName}</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. QR Code Section */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 shadow-xl mt-6 flex flex-col items-center text-center space-y-4">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest border-l-2 border-indigo-500 pl-3 self-start text-left">
            Card QR Code
          </h2>
          <p className="text-xs text-slate-400 max-w-sm">
            Scan this dynamic code on any cell phone to directly load this digital business card URL.
          </p>

          <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-800 min-h-[212px] flex items-center justify-center">
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
              <div className="w-44 h-44 bg-slate-900/50 animate-pulse rounded-2xl flex items-center justify-center text-[9px] text-slate-500 font-bold uppercase tracking-widest border border-slate-800">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex gap-2.5 w-full max-w-sm">
            <button
              onClick={() => handleDownloadQR('png')}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              Download PNG
            </button>
            <button
              onClick={() => handleDownloadQR('svg')}
              className="flex-1 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-95"
            >
              Download SVG
            </button>
          </div>
        </div>

        {/* 9. Contact / Lead Form Section */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 shadow-xl mt-6 space-y-4">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">
            Send Quick Enquiry
          </h2>
          <p className="text-xs text-slate-400">
            Have questions or request quote estimates? Drop details below.
          </p>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Your Name *</label>
              <input
                type="text"
                required
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                placeholder="Rahul Varma"
                className="px-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-200 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Mobile Number *</label>
              <input
                type="tel"
                required
                value={leadForm.mobile}
                onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                placeholder="99999 11111"
                className="px-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-200 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Email Address</label>
              <input
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                placeholder="rahul@gmail.com"
                className="px-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-200 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase pl-0.5">Inquiry Message *</label>
              <textarea
                rows={3}
                required
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                placeholder="Details of what services or project discussions you want..."
                className="px-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-200 transition-colors resize-none"
              />
            </div>

            {success && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/30 rounded-xl text-emerald-300 text-xs font-semibold text-center animate-pulse">
                Inquiry registered successfully! We will get in touch with you shortly.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-950/30 transition-all flex items-center justify-center gap-1.5"
            >
              {submitting ? 'Submitting Form...' : 'Send Inquiry Message'}
            </button>
          </form>
        </div>

        {/* 10. Contact Details list */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 shadow-xl mt-6 space-y-4">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest border-l-2 border-indigo-500 pl-3">
            Contact Directory
          </h2>
          <div className="space-y-4 text-xs text-slate-350">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-slate-200">Mobile Numbers</span>
                <span className="block mt-0.5 text-slate-400">{card.mobile}</span>
                {card.alternateMobile && <span className="block text-slate-500 mt-0.5">{card.alternateMobile}</span>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-slate-200">Email Address</span>
                <span className="block mt-0.5 text-slate-400">{card.email}</span>
              </div>
            </div>

            {card.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-slate-200">Office Location</span>
                  <span className="block mt-0.5 leading-relaxed text-slate-400">{card.address}</span>
                  {card.mapsLink && (
                    <a href={card.mapsLink} target="_blank" className="inline-flex items-center gap-1 text-[10px] text-indigo-400 font-bold mt-1.5 hover:underline uppercase tracking-wider">
                      Launch Maps
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {card.website && (
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-slate-200">Website Address</span>
                  <a href={card.website} target="_blank" className="text-indigo-400 hover:underline inline-flex items-center gap-1 mt-0.5 font-bold">
                    {card.website}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer brand info */}
        <div className="text-center text-slate-600 text-[10px] mt-10 font-bold tracking-widest uppercase">
          Digitized by VCard Studio
        </div>
      </div>
    </div>
  );
}
