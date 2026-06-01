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
  ChevronRight
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

export default function Template3({
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
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] pb-20 font-sans">
      {/* Cover picture */}
      <div className="h-44 md:h-56 w-full overflow-hidden bg-[#F0F0F0]">
        {card.coverImage ? (
          <img src={card.coverImage} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Business banner" />
        ) : (
          <div className="w-full h-full bg-[#E5E5E5]" />
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 relative">
        {/* Profile Card details */}
        <div className="bg-white border border-[#E5E5E5] rounded-none p-8 -mt-16 relative z-10 shadow-sm flex flex-col items-center text-center space-y-4">
          
          {card.profileImage ? (
            <img 
              src={card.profileImage} 
              alt={card.ownerName}
              className="w-24 h-24 rounded-none object-cover border border-[#E5E5E5] -mt-20 bg-white p-1"
            />
          ) : (
            <div className="w-24 h-24 bg-[#1A1A1A] rounded-none flex items-center justify-center font-bold text-3xl text-white -mt-20">
              {card.ownerName.charAt(0)}
            </div>
          )}

          {card.logo && (
            <img src={card.logo} className="h-6 object-contain opacity-70 grayscale" alt="Logo" />
          )}

          <div className="space-y-1">
            <h1 className="text-xl font-bold uppercase tracking-widest">{card.businessName}</h1>
            <span className="text-[10px] text-[#7A7A7A] block font-bold uppercase tracking-wider">{card.category}</span>
          </div>

          <div className="border-t border-b border-[#F0F0F0] py-3.5 w-full text-xs font-semibold text-[#555] uppercase tracking-wider">
            {card.ownerName} — {card.designation}
          </div>

          {/* Quick CTA Links */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <a
              href={`tel:${card.mobile}`}
              onClick={() => onActionClick('click_call')}
              className="flex items-center justify-center gap-1.5 py-3 bg-[#1A1A1A] text-white hover:bg-black rounded-none text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href={`https://wa.me/${card.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              onClick={() => onActionClick('click_whatsapp')}
              className="flex items-center justify-center gap-1.5 py-3 bg-white border border-[#E5E5E5] hover:bg-[#FAFAFA] text-[#1A1A1A] rounded-none text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
            <button
              onClick={() => {
                onActionClick('click_vcf');
                downloadVCard(card);
              }}
              className="flex items-center justify-center gap-1.5 py-3 bg-white border border-[#E5E5E5] hover:bg-[#FAFAFA] text-[#1A1A1A] rounded-none text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add VCard
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 py-3 bg-white border border-[#E5E5E5] hover:bg-[#FAFAFA] text-[#1A1A1A] rounded-none text-xs font-bold uppercase tracking-wider transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copied' : 'Share Link'}
            </button>
          </div>
        </div>

        {/* 3. About Business */}
        <div className="bg-white border border-[#E5E5E5] rounded-none p-6 shadow-sm mt-6 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#7A7A7A] border-b border-[#F0F0F0] pb-2">
            Professional Statement
          </h2>
          <p className="text-xs text-[#555] leading-relaxed font-medium">
            {card.description || 'Welcome to our minimal portfolio card page. Please read our design portfolio, view images, and submit custom requests.'}
          </p>
        </div>

        {/* 4. Portfolio Showcase Gallery (Visual Masonry Grid) */}
        {gallery.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-none p-6 shadow-sm mt-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#7A7A7A] border-b border-[#F0F0F0] pb-2">
              Visual Portfolio Grid
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative rounded-none overflow-hidden aspect-video border border-[#E5E5E5] bg-slate-100 group">
                  <img 
                    src={img.imageUrl} 
                    alt="Portfolio asset" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 border border-transparent group-hover:border-black/10 transition-colors pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Services Listing */}
        {services.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-none p-6 shadow-sm mt-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#7A7A7A] border-b border-[#F0F0F0] pb-2">
              Services We Provide
            </h2>
            <div className="space-y-4 divide-y divide-[#F0F0F0]">
              {services.map((svc) => (
                <div key={svc.id} className="flex gap-4 pt-4 first:pt-0">
                  {svc.image && (
                    <img 
                      src={svc.image} 
                      alt={svc.title}
                      className="w-16 h-16 rounded-none object-cover border border-[#E5E5E5] flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-xs font-extrabold uppercase tracking-wide text-black">{svc.title}</h3>
                    <p className="text-xs text-[#555] mt-1.5 leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Videos */}
        {videos.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-none p-6 shadow-sm mt-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#7A7A7A] border-b border-[#F0F0F0] pb-2">
              Video Showcase
            </h2>
            <div className="space-y-4">
              {videos.map((vid) => {
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = vid.youtubeUrl.match(regExp);
                const videoId = (match && match[2].length === 11) ? match[2] : null;

                if (!videoId) return null;
                return (
                  <div key={vid.id} className="relative w-full rounded-none overflow-hidden aspect-video border border-[#E5E5E5]">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full grayscale hover:grayscale-0 transition-all duration-550"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Testimonials */}
        {testimonials.length > 0 && (
          <div className="bg-white border border-[#E5E5E5] rounded-none p-6 shadow-sm mt-6 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-[#7A7A7A] border-b border-[#F0F0F0] pb-2">
              Client Feedback
            </h2>
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-4 bg-[#FAFAFA] border border-[#E5E5E5] rounded-none space-y-2 text-xs">
                  <div className="flex gap-2.5 items-center">
                    {t.photo ? (
                      <img src={t.photo} className="w-8 h-8 rounded-none object-cover border border-[#E5E5E5] grayscale" alt={t.customerName} />
                    ) : (
                      <div className="w-8 h-8 bg-black text-white font-bold flex items-center justify-center text-[10px]">
                        {t.customerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="block font-bold text-black uppercase tracking-wider">{t.customerName}</span>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < t.rating ? 'fill-black text-black' : 'text-slate-205'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#555] italic leading-relaxed pt-1 border-t border-[#F0F0F0]">
                    &ldquo;{t.review}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. QR Code Section */}
        <div className="bg-white border border-[#E5E5E5] rounded-none p-6 shadow-sm mt-6 flex flex-col items-center text-center space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#7A7A7A] border-b border-[#F0F0F0] pb-2 self-start text-left">
            Scan & Access Card
          </h2>
          <p className="text-xs text-[#555] max-w-sm">
            Scan this minimalist QR code from any smartphone camera to launch the live web URL.
          </p>

          <div className="p-3 bg-[#FAFAFA] border border-[#E5E5E5] rounded-none min-h-[206px] flex items-center justify-center">
            {mounted ? (
              <QRCodeSVG
                id="card-qr-code"
                value={shareUrl}
                size={180}
                level="H"
                includeMargin={true}
                className="w-44 h-44 grayscale"
              />
            ) : (
              <div className="w-44 h-44 bg-slate-50 animate-pulse rounded-none flex items-center justify-center text-[9px] text-slate-400 font-bold uppercase tracking-widest border border-slate-100">
                Generating QR...
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full max-w-sm">
            <button
              onClick={() => handleDownloadQR('png')}
              className="flex-1 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors rounded-none"
            >
              PNG
            </button>
            <button
              onClick={() => handleDownloadQR('svg')}
              className="flex-1 py-2.5 bg-white border border-[#E5E5E5] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider hover:bg-[#FAFAFA] transition-colors rounded-none"
            >
              SVG
            </button>
          </div>
        </div>

        {/* 9. Contact / Lead Form */}
        <div className="bg-white border border-[#E5E5E5] rounded-none p-6 shadow-sm mt-6 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#7A7A7A] border-b border-[#F0F0F0] pb-2">
            Submit Design Enquiry
          </h2>
          <p className="text-xs text-[#555]">
            Drop custom project estimates or brief specs. We respond within 24 hours.
          </p>

          <form onSubmit={handleSubmitLead} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[#7A7A7A] uppercase pl-0.5 tracking-wider">Your Name *</label>
              <input
                type="text"
                required
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                placeholder="Rahul Varma"
                className="px-3 py-2 bg-white border border-[#E5E5E5] focus:border-black focus:outline-none rounded-none text-xs text-slate-800 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[#7A7A7A] uppercase pl-0.5 tracking-wider">Mobile Number *</label>
              <input
                type="tel"
                required
                value={leadForm.mobile}
                onChange={(e) => setLeadForm({ ...leadForm, mobile: e.target.value })}
                placeholder="99999 11111"
                className="px-3 py-2 bg-white border border-[#E5E5E5] focus:border-black focus:outline-none rounded-none text-xs text-slate-800 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[#7A7A7A] uppercase pl-0.5 tracking-wider">Email Address</label>
              <input
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                placeholder="rahul@gmail.com"
                className="px-3 py-2 bg-white border border-[#E5E5E5] focus:border-black focus:outline-none rounded-none text-xs text-slate-800 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-[#7A7A7A] uppercase pl-0.5 tracking-wider">Brief Message *</label>
              <textarea
                rows={3}
                required
                value={leadForm.message}
                onChange={(e) => setLeadForm({ ...leadForm, message: e.target.value })}
                placeholder="Brief project details, deliverables, or site address..."
                className="px-3 py-2 bg-white border border-[#E5E5E5] focus:border-black focus:outline-none rounded-none text-xs text-slate-800 transition-colors resize-none"
              />
            </div>

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-250 rounded-none text-emerald-800 text-[11px] font-bold text-center">
                Project details registered! We will call you back shortly.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-black text-white hover:bg-[#333] text-xs font-bold uppercase tracking-wider rounded-none transition-colors"
            >
              {submitting ? 'Submitting Brief...' : 'Send Project Brief'}
            </button>
          </form>
        </div>

        {/* 10. Contact Details list */}
        <div className="bg-white border border-[#E5E5E5] rounded-none p-6 shadow-sm mt-6 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-[#7A7A7A] border-b border-[#F0F0F0] pb-2">
            Corporate Details
          </h2>
          <div className="space-y-4 text-xs font-medium text-[#555]">
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-black uppercase tracking-wider text-[10px]">Mobile Numbers</span>
                <span className="block mt-1">{card.mobile}</span>
                {card.alternateMobile && <span className="block text-slate-500 mt-0.5">{card.alternateMobile}</span>}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
              <div>
                <span className="block font-bold text-black uppercase tracking-wider text-[10px]">Email Address</span>
                <span className="block mt-1">{card.email}</span>
              </div>
            </div>

            {card.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-black uppercase tracking-wider text-[10px]">Atelier Address</span>
                  <span className="block mt-1 leading-relaxed">{card.address}</span>
                  {card.mapsLink && (
                    <a href={card.mapsLink} target="_blank" className="inline-flex items-center gap-1 text-[9px] text-black font-extrabold mt-1.5 hover:underline uppercase tracking-wider">
                      Launch Google Maps
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {card.website && (
              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-bold text-black uppercase tracking-wider text-[10px]">Atelier Domain</span>
                  <a href={card.website} target="_blank" className="text-black hover:underline inline-flex items-center gap-1 mt-1 font-bold">
                    {card.website}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 11. Social Links Footer */}
        <div className="flex items-center justify-center flex-wrap gap-3.5 mt-8">
          {card.facebookUrl && <a href={card.facebookUrl} target="_blank" className="p-2.5 bg-white border border-[#E5E5E5] rounded-none hover:bg-black hover:text-white text-slate-500 shadow-sm transition-all"><FacebookIcon /></a>}
          {card.instagramUrl && <a href={card.instagramUrl} target="_blank" className="p-2.5 bg-white border border-[#E5E5E5] rounded-none hover:bg-black hover:text-white text-slate-500 shadow-sm transition-all"><InstagramIcon /></a>}
          {card.linkedinUrl && <a href={card.linkedinUrl} target="_blank" className="p-2.5 bg-white border border-[#E5E5E5] rounded-none hover:bg-black hover:text-white text-slate-500 shadow-sm transition-all"><LinkedinIcon /></a>}
          {card.youtubeUrl && <a href={card.youtubeUrl} target="_blank" className="p-2.5 bg-white border border-[#E5E5E5] rounded-none hover:bg-black hover:text-white text-slate-500 shadow-sm transition-all"><YoutubeIcon /></a>}
        </div>

        {/* Footer brand info */}
        <div className="text-center text-slate-400 text-[9px] mt-10 font-bold uppercase tracking-widest">
          Portfolio Archive by VCard Studio
        </div>
      </div>
    </div>
  );
}
