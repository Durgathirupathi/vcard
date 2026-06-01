'use client';

import React from 'react';
import CardForm from '../../../../components/admin/CardForm';
import { dbService } from '../../../../lib/firestore';
import { BusinessCard, Service, GalleryImage, Video, Testimonial } from '../../../../types';

export default function CreateCardPage() {
  const handleSave = async (data: {
    card: BusinessCard;
    services: Service[];
    gallery: GalleryImage[];
    videos: Video[];
    testimonials: Testimonial[];
  }) => {
    // 1. Save Card Core details
    await dbService.saveBusiness(data.card);
    
    // 2. Save related entities
    await dbService.saveServices(data.card.id, data.services);
    await dbService.saveGalleryImages(data.card.id, data.gallery);
    await dbService.saveVideos(data.card.id, data.videos);
    await dbService.saveTestimonials(data.card.id, data.testimonials);
  };

  return (
    <CardForm onSave={handleSave} />
  );
}
