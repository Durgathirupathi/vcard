'use client';

import React, { useEffect } from 'react';
import { BusinessCard, Service, GalleryImage, Video, Testimonial, Lead, AnalyticsEntry } from '../../types';
import { dbService } from '../../lib/firestore';

// Import the 5 custom templates
import Template1 from '../../components/templates/Template1';
import Template2 from '../../components/templates/Template2';
import Template3 from '../../components/templates/Template3';
import Template4 from '../../components/templates/Template4';
import Template5 from '../../components/templates/Template5';

interface CardViewClientProps {
  card: BusinessCard;
  services: Service[];
  gallery: GalleryImage[];
  videos: Video[];
  testimonials: Testimonial[];
}

export default function CardViewClient({
  card,
  services,
  gallery,
  videos,
  testimonials
}: CardViewClientProps) {

  // ==========================================
  // VIEW ANALYTICS LOGGING (Unique per Session)
  // ==========================================
  useEffect(() => {
    async function recordView() {
      const sessionKey = `vcard_viewed_${card.id}`;
      if (typeof window !== 'undefined') {
        const alreadyViewed = sessionStorage.getItem(sessionKey);
        if (!alreadyViewed) {
          const entry: AnalyticsEntry = {
            id: `anal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            businessId: card.id,
            eventType: 'view',
            createdAt: new Date().toISOString()
          };
          try {
            await dbService.saveAnalytics(entry);
            sessionStorage.setItem(sessionKey, 'true');
          } catch (err) {
            console.error('Failed to log view analytics', err);
          }
        }
      }
    }
    recordView();
  }, [card.id]);

  // ==========================================
  // CLICK ACTION ANALYTICS LOGGING
  // ==========================================
  const handleActionClick = async (type: 'click_call' | 'click_whatsapp' | 'click_vcf') => {
    const entry: AnalyticsEntry = {
      id: `anal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      businessId: card.id,
      eventType: type,
      createdAt: new Date().toISOString()
    };
    try {
      await dbService.saveAnalytics(entry);
    } catch (err) {
      console.error(`Failed to log action ${type}`, err);
    }
  };

  // ==========================================
  // LEAD / QUICK ENQUIRY CAPTURE SUBMISSION
  // ==========================================
  const handleSubmitLead = async (leadDetails: { name: string; mobile: string; email: string; message: string }) => {
    const lead: Lead = {
      id: `lead_${Date.now()}`,
      businessId: card.id,
      name: leadDetails.name,
      mobile: leadDetails.mobile,
      email: leadDetails.email,
      message: leadDetails.message,
      createdAt: new Date().toISOString()
    };

    // 1. Save Lead to Firestore/Local Storage
    await dbService.saveLead(lead);

    // 2. Also log analytics of submission event type
    const analEntry: AnalyticsEntry = {
      id: `anal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      businessId: card.id,
      eventType: 'submit_lead',
      createdAt: new Date().toISOString()
    };
    await dbService.saveAnalytics(analEntry);
  };

  // ==========================================
  // DYNAMIC TEMPLATE DISPATCHER
  // ==========================================
  const renderTemplate = () => {
    const props = {
      card,
      services,
      gallery,
      videos,
      testimonials,
      onSubmitLead: handleSubmitLead,
      onActionClick: handleActionClick
    };

    switch (card.templateId) {
      case 'template2':
        return <Template2 {...props} />;
      case 'template3':
        return <Template3 {...props} />;
      case 'template4':
        return <Template4 {...props} />;
      case 'template5':
        return <Template5 {...props} />;
      case 'template1':
      default:
        return <Template1 {...props} />;
    }
  };

  return <>{renderTemplate()}</>;
}
