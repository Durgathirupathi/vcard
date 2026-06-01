export interface AppUser {
  uid: string;
  email: string;
  role: 'super_admin' | 'business_owner';
  businessId?: string;
}

export interface BusinessCard {
  id: string;
  businessName: string;
  slug: string;
  ownerName: string;
  designation: string;
  category: string;
  description: string;
  templateId: string;
  mobile: string;
  whatsapp: string;
  alternateMobile?: string;
  email: string;
  website?: string;
  address?: string;
  mapsLink?: string;
  profileImage?: string;
  coverImage?: string;
  logo?: string;
  createdAt: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  telegramUrl?: string;
  twitterUrl?: string;
  ownerUid?: string;
  ownerEmail?: string;
  ownerPassword?: string;
  status?: 'active' | 'inactive';
}

export interface Service {
  id: string;
  businessId: string;
  title: string;
  description: string;
  image?: string;
}

export interface GalleryImage {
  id: string;
  businessId: string;
  imageUrl: string;
}

export interface Video {
  id: string;
  businessId: string;
  youtubeUrl: string;
}

export interface Testimonial {
  id: string;
  businessId: string;
  customerName: string;
  review: string;
  rating: number; // 1-5
  photo?: string;
}

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  mobile: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface AnalyticsEntry {
  id: string;
  businessId: string;
  eventType: 'view' | 'click_call' | 'click_whatsapp' | 'click_vcf' | 'submit_lead';
  createdAt: string;
}
