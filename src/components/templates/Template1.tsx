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
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Custom Brand SVGs (satisfies newer lucide icon brand removals)
const FacebookIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.163c-.272-.997-1.04-1.781-2.016-2.056-1.782-.48-8.982-.48-8.982-.48s-7.2.001-8.982.48c-.976.275-1.744 1.059-2.016 2.056-.479 1.787-.479 5.52-.479 5.52s-.001 3.733.479 5.52c.272.997 1.04 1.781 2.016 2.056 1.782.48 8.982.48 8.982.48s7.201-.001 8.982-.48c.976-.275 1.744-1.059 2.016-2.056.479-1.787.479-5.52.479-5.52s.001-3.733-.479-5.52zM9.545 15.568V8.113l6.452 3.728-6.452 3.727z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.05 5.56-5.022c.24-.213-.054-.33-.373-.121l-6.87 4.326-2.96-.924c-.643-.201-.657-.641.135-.95l11.57-4.462c.535-.201.101.406-.115.54z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
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

export default function Template1({
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

  // Dynamic absolute page URL for Sharing & QR Code
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
      // PNG download via Canvas drawing
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
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 font-sans">
      {/* 1. Header Banner & Branding Photo */}
      <div className="relative h-48 md:h-64 w-full bg-slate-300">
        {card.coverImage ? (
          <img src={card.coverImage} className="w-full h-full object-cover" alt="Business banner" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-900" />
        )}
      </div>

      <div className="max-w-xl mx-auto px-4">
        {/* Profile Card Overlay */}
        <div className="relative -mt-20 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col items-center text-center">
          {card.profileImage ? (
            <img 
              src={card.profileImage} 
              alt={card.ownerName}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg -mt-20 bg-slate-100"
            />
          ) : (
            <div className="w-28 h-28 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-4xl text-white border-4 border-white shadow-lg -mt-20">
              {card.ownerName.charAt(0)}
            </div>
          )}

          {card.logo && (
            <img src={card.logo} className="h-8 object-contain my-3" alt="Logo" />
          )}

          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{card.businessName}</h1>
          <p className="text-sm font-semibold text-indigo-600 mt-1 uppercase tracking-wider">{card.category}</p>
          
          <div className="mt-3">
            <span className="text-sm font-bold text-slate-800">{card.ownerName}</span>
            <span className="text-xs text-slate-500 block">{card.designation}</span>
          </div>

          {/* 2. Top-Aligned Quick Actions CTA */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <a
              href={`tel:${card.mobile}`}
              onClick={() => onActionClick('click_call')}
              className="flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-900/10 transition-all active:scale-95"
            >
              <Phone className="w-4.5 h-4.5" />
              Call Now
            </a>
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              onClick={() => onActionClick('click_whatsapp')}
              className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-950/10 transition-all active:scale-95"
            >
              <MessageSquare className="w-4.5 h-4.5 fill-white text-emerald-600" />
              WhatsApp
            </a>
            <button
              onClick={() => {
                onActionClick('click_vcf');
                downloadVCard(card);
              }}
              className="flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4.5 h-4.5" />
              Save Contact
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition-all active:scale-95"
            >
              {copied ? <Check className="w-4.5 h-4.5 text-indigo-600" /> : <Share2 className="w-4.5 h-4.5" />}
              {copied ? 'Copied!' : 'Share Card'}
            </button>
          </div>
        </div>

        {/* 3. About Business */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md mt-6 space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3">
            About Our Business
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {card.description || 'Welcome to our digital business profile page! Please read through our services, browse our products and achievements gallery, or fill out the enquiry form below to contact us.'}
          </p>
        </div>

        {/* 4. Services Grid */}
        {services.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md mt-6 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3">
              Services & Products
            </h2>
            <div className="space-y-4">
              {services.map((svc) => (
                <div key={svc.id} className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl border border-slate-100 transition-colors">
                  {svc.image && (
                    <img 
                      src={svc.image} 
                      alt={svc.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{svc.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Image Gallery */}
        {gallery.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md mt-6 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3">
              Business Showcase Gallery
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img) => (
                <div key={img.id} className="relative rounded-2xl overflow-hidden aspect-video border border-slate-100 shadow-sm bg-slate-900 group">
                  <img 
                    src={img.imageUrl} 
                    alt="Showcase" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Video Gallery */}
        {videos.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md mt-6 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3">
              Featured Video Showcase
            </h2>
            <div className="space-y-4">
              {videos.map((vid) => {
                // Parse video ID from youtube URL
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = vid.youtubeUrl.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (!videoId) return null;
                return (
                  <div key={vid.id} className="relative w-full rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-sm">
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

        {/* 7. Testimonials Section */}
        {testimonials.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md mt-6 space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3">
              Client Testimonials
            </h2>
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex gap-3 items-center">
                    {t.photo ? (
                      <img src={t.photo} className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-200" alt={t.customerName} />
                    ) : (
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-sm text-white">
                        {t.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="block text-xs font-bold text-slate-900">{t.customerName}</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. QR Code Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md mt-6 flex flex-col items-center text-center space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3 self-start text-left">
            Scan QR Code
          </h2>
          <p className="text-xs text-slate-500 max-w-sm">
            Scan this code from any phone to immediately open and share our digital business card page.
          </p>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-inner min-h-[212px] flex items-center justify-center">
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
              <div className="w-44 h-44 bg-slate-100/50 animate-pulse rounded-2xl flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex gap-2.5 w-full max-w-sm">
            <button
              onClick={() => handleDownloadQR('png')}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95"
            >
              Download PNG
            </button>
            <button
              onClick={() => handleDownloadQR('svg')}
              className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow transition-all active:scale-95"
            >
              Download SVG
            </button>
          </div>
        </div>

        {/* 9. Contact / Lead Form Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md mt-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3">
            Submit Quick Enquiry
          </h2>
          <p className="text-xs text-slate-500">
            Fill in your details below, and our business director will contact you shortly.
          </p>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase pl-0.5">Your Name *</label>
              <input
                type="text"
                required
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                placeholder="Rahul Varma"
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase pl-0.5">Mobile Number *</label>
              <input
                type="tel"
                required
                value={leadForm.mobile}
                onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                placeholder="99999 11111"
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase pl-0.5">Email Address</label>
              <input
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                placeholder="rahul@gmail.com"
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase pl-0.5">Inquiry Message *</label>
              <textarea
                rows={3}
                required
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                placeholder="Details of what service or product advice you are looking for..."
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 transition-colors resize-none"
              />
            </div>

            {success && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold text-center">
                Your enquiry was submitted successfully! We will get in touch shortly.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-900/10 transition-all flex items-center justify-center gap-1.5"
            >
              {submitting ? 'Submitting Inquiry...' : 'Submit Inquiry Form'}
            </button>
          </form>
        </div>

        {/* 10. Contact Info Details Panel */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md mt-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-3">
            Contact Information
          </h2>
          <div className="space-y-3.5 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-slate-900">Phone Numbers</span>
                <span className="block mt-0.5">{card.mobile}</span>
                {card.alternateMobile && <span className="block text-xs">{card.alternateMobile}</span>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-slate-900">Email Address</span>
                <span className="block mt-0.5">{card.email}</span>
              </div>
            </div>

            {card.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-slate-900">Office Location</span>
                  <span className="block mt-0.5 leading-relaxed">{card.address}</span>
                  {card.mapsLink && (
                    <a href={card.mapsLink} target="_blank" className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold mt-1.5 hover:underline">
                      View on Google Maps
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {card.website && (
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-slate-900">Company Website</span>
                  <a href={card.website} target="_blank" className="text-indigo-600 hover:underline inline-flex items-center gap-1 mt-0.5 font-semibold">
                    {card.website}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 11. Social footer icons */}
        <div className="flex items-center justify-center flex-wrap gap-4 mt-8">
          {card.facebookUrl && (
            <a href={card.facebookUrl} target="_blank" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-indigo-50 hover:text-blue-600 hover:border-blue-200 text-slate-500 shadow-sm transition-all">
              <FacebookIcon />
            </a>
          )}
          {card.instagramUrl && (
            <a href={card.instagramUrl} target="_blank" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-indigo-50 hover:text-pink-600 hover:border-pink-200 text-slate-500 shadow-sm transition-all">
              <InstagramIcon />
            </a>
          )}
          {card.linkedinUrl && (
            <a href={card.linkedinUrl} target="_blank" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-indigo-50 hover:text-blue-500 hover:border-blue-200 text-slate-500 shadow-sm transition-all">
              <LinkedinIcon />
            </a>
          )}
          {card.youtubeUrl && (
            <a href={card.youtubeUrl} target="_blank" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-indigo-50 hover:text-red-500 hover:border-red-200 text-slate-500 shadow-sm transition-all">
              <YoutubeIcon />
            </a>
          )}
          {card.telegramUrl && (
            <a href={card.telegramUrl} target="_blank" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-indigo-50 hover:text-blue-400 hover:border-blue-200 text-slate-500 shadow-sm transition-all">
              <TelegramIcon />
            </a>
          )}
          {card.twitterUrl && (
            <a href={card.twitterUrl} target="_blank" className="p-3 bg-white border border-slate-200 rounded-full hover:bg-indigo-50 hover:text-sky-500 hover:border-sky-200 text-slate-500 shadow-sm transition-all">
              <TwitterIcon />
            </a>
          )}
        </div>

        {/* Footer info brand */}
        <div className="text-center text-slate-400 text-[10px] mt-10 font-medium">
          Created with VCard Studio. All rights reserved.
        </div>
      </div>
    </div>
  );
}
