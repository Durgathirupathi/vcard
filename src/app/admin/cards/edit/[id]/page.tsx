'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CardForm from '../../../../../components/admin/CardForm';
import { dbService } from '../../../../../lib/firestore';
import { BusinessCard, Service, GalleryImage, Video, Testimonial, AppUser } from '../../../../../types';

export default function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;
  
  const [card, setCard] = useState<BusinessCard | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Defense-in-depth tenant check
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('vcard_active_user');
      if (userStr) {
        const u: AppUser = JSON.parse(userStr);
        if (u.role === 'business_owner' && u.businessId !== id) {
          router.push('/admin');
          return;
        }
      }
    }

    async function loadData() {
      try {
        const fetchCard = await dbService.getBusinessById(id);
        if (fetchCard) {
          setCard(fetchCard);
          const s = await dbService.getServices(id);
          const g = await dbService.getGalleryImages(id);
          const v = await dbService.getVideos(id);
          const t = await dbService.getTestimonials(id);
          setServices(s);
          setGallery(g);
          setVideos(v);
          setTestimonials(t);
        }
      } catch (err) {
        console.error('Failed to load card edit data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSave = async (data: {
    card: BusinessCard;
    services: Service[];
    gallery: GalleryImage[];
    videos: Video[];
    testimonials: Testimonial[];
  }) => {
    await dbService.saveBusiness(data.card);
    await dbService.saveServices(data.card.id, data.services);
    await dbService.saveGalleryImages(data.card.id, data.gallery);
    await dbService.saveVideos(data.card.id, data.videos);
    await dbService.saveTestimonials(data.card.id, data.testimonials);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-400">Loading card configurations...</span>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="p-8 text-center bg-slate-905 border border-slate-850 rounded-2xl text-slate-400">
        The requested digital business card configuration details could not be found.
      </div>
    );
  }

  return (
    <CardForm
      initialCard={card}
      initialServices={services}
      initialGallery={gallery}
      initialVideos={videos}
      initialTestimonials={testimonials}
      onSave={handleSave}
    />
  );
}
