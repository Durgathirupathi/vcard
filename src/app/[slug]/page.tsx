import React from 'react';
import { Metadata } from 'next';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-6 text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
        <p className="text-sm max-w-md">
          The digital business card matching the slug <span className="text-indigo-400 font-mono">&quot;/{slug}&quot;</span> does not exist or has been deleted by the administrator.
        </p>
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
