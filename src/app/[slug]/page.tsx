import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { dbService } from '../../lib/firestore';
import CardViewClient from './CardViewClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ==========================================
// DYNAMIC SEO METADATA GENERATOR (PRD Compliant)
// ==========================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const unwrappedParams = await params;
  const card = await dbService.getBusinessBySlug(unwrappedParams.slug);

  if (!card) {
    return {
      title: 'VCard Not Found',
      description: 'The requested digital business profile page was not found.',
    };
  }

  const titleText = `${card.businessName} | Digital Business Card`;
  const descText = card.description || `${card.ownerName} - ${card.designation} (${card.category})`;
  const ogImg = card.profileImage || card.coverImage || '';

  return {
    title: titleText,
    description: descText,
    openGraph: {
      title: titleText,
      description: descText,
      url: `https://vcard.studio/${card.slug}`,
      type: 'profile',
      images: ogImg ? [{ url: ogImg, width: 600, height: 600, alt: card.businessName }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: titleText,
      description: descText,
      images: ogImg ? [ogImg] : undefined,
    }
  };
}

export default async function PublicCardPage({ params }: PageProps) {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  
  // Fetch from unified Firestore/Fallback DB
  const card = await dbService.getBusinessBySlug(slug);

  if (!card) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900 p-6 text-center selection:bg-brown-200/50 selection:text-brown-900">
        <div className="absolute inset-0 grid-accent opacity-30 pointer-events-none z-0"></div>
        <div className="relative z-10 max-w-md w-full bg-white border border-brown-200 rounded-3xl p-8 sm:p-10 shadow-lg text-center space-y-4">
          <h1 className="text-3xl font-black text-stone-900 font-display">Profile Not Found</h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-medium">
            The digital business card matching the slug <span className="text-brown-755 font-mono font-bold">&quot;/{slug}&quot;</span> does not exist or has been archived by the administrator.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="w-full px-6 py-3.5 bg-brown-700 hover:bg-brown-755 text-white rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fetch related child elements
  const services = await dbService.getServices(card.id);
  const gallery = await dbService.getGalleryImages(card.id);
  const videos = await dbService.getVideos(card.id);
  const testimonials = await dbService.getTestimonials(card.id);

  return (
    <CardViewClient
      card={card}
      services={services}
      gallery={gallery}
      videos={videos}
      testimonials={testimonials}
    />
  );
}
