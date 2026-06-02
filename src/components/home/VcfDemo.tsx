'use client';

import React, { useState } from 'react';
import { UserPlus, Sparkles, Check, DownloadCloud, FileText } from 'lucide-react';

export default function VcfDemo() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    // Generate a simple dynamic VCF string
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
N:Doe;John;;;
FN:John Doe
ORG:VCard Studio Inc.
TITLE:Product Architect & Founder
TEL;TYPE=CELL,VOICE:+1234567890
EMAIL;TYPE=PREF,INTERNET:john.doe@vcard.studio
URL:https://vcard.studio
END:VCARD`;

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'john_doe_contact.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <section className="relative z-10 max-w-6xl mx-auto px-6 py-12 scroll-mt-24">
      <div className="bg-white border border-brown-200 rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        
        {/* Decorative Grid Mesh Background */}
        <div className="absolute inset-0 grid-accent opacity-[0.08] pointer-events-none z-0"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Interactive Preview Widget */}
          <div className="bg-stone-50 border border-brown-100 rounded-2xl p-6 space-y-4 text-left shadow-inner">
            <div className="flex items-center justify-between border-b border-brown-100/70 pb-3">
              <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-stone-400" />
                VCF Metadata Card
              </span>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md">
                Standard VCard
              </span>
            </div>

            <div className="space-y-3.5 text-xs text-stone-600 font-semibold">
              <div>
                <span className="block text-[9px] text-stone-400 uppercase font-black tracking-widest mb-0.5">Full Name</span>
                <span className="text-stone-900 font-bold">John Doe</span>
              </div>
              <div>
                <span className="block text-[9px] text-stone-400 uppercase font-black tracking-widest mb-0.5">Designation & Org</span>
                <span className="text-stone-900 font-bold">Product Architect • VCard Studio Inc.</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] text-stone-400 uppercase font-black tracking-widest mb-0.5">Mobile Phone</span>
                  <span className="text-stone-900 font-bold">+1 (234) 567-890</span>
                </div>
                <div>
                  <span className="block text-[9px] text-stone-400 uppercase font-black tracking-widest mb-0.5">Direct Email</span>
                  <span className="text-stone-900 font-bold truncate block">john.doe@vcard.studio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Copy Description and download action */}
          <div className="space-y-6 text-left">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-brown-700">Try it out</span>
              <h2 className="text-2xl font-extrabold text-stone-900 font-display mt-0.5">Save Contact Live Demo</h2>
              <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-medium mt-2">
                Click the interactive button below to trigger an actual, system-generated VCF file download to see how your future clients will save your contact card.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className={`px-6 py-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md w-full sm:w-auto hover:scale-[1.01] ${
                downloaded 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-brown-700 hover:bg-brown-755 text-white'
              }`}
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4" />
                  Contact Saved Successfully!
                </>
              ) : (
                <>
                  <DownloadCloud className="w-4 h-4" />
                  Download Contact Example (.VCF)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
