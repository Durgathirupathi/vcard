'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessCard, Service, GalleryImage, Video, Testimonial, AppUser } from '../../types';
import { dbService } from '../../lib/firestore';
import { auth, isFirebaseConfigured, createFirebaseUser } from '../../lib/firebase';
import { PORTAL_LIMITS } from '../../lib/constants';
import { 
  Save, 
  ArrowLeft, 
  Info, 
  Image as ImageIcon, 
  Briefcase, 
  MessageSquare, 
  Video as VideoIcon,
  Plus, 
  Trash2, 
  AlertTriangle,
  Star,
  Settings,
  Globe,
  Link as LinkIcon
} from 'lucide-react';
import ImageUpload from '../common/ImageUpload';

// Custom Brand SVGs for platform stability (brand icons removed in newer lucide-react versions)
const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current text-blue-500" viewBox="0 0 24 24">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2 text-pink-500" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current text-red-500" viewBox="0 0 24 24">
    <path d="M23.498 6.163c-.272-.997-1.04-1.781-2.016-2.056-1.782-.48-8.982-.48-8.982-.48s-7.2.001-8.982.48c-.976.275-1.744 1.059-2.016 2.056-.479 1.787-.479 5.52-.479 5.52s-.001 3.733.479 5.52c.272.997 1.04 1.781 2.016 2.056 1.782.48 8.982.48 8.982.48s7.201-.001 8.982-.48c.976-.275 1.744-1.059 2.016-2.056.479-1.787.479-5.52.479-5.52s.001-3.733-.479-5.52zM9.545 15.568V8.113l6.452 3.728-6.452 3.727z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.05 5.56-5.022c.24-.213-.054-.33-.373-.121l-6.87 4.326-2.96-.924c-.643-.201-.657-.641.135-.95l11.57-4.462c.535-.201.101.406-.115.54z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);


interface CardFormProps {
  initialCard?: BusinessCard;
  initialServices?: Service[];
  initialGallery?: GalleryImage[];
  initialVideos?: Video[];
  initialTestimonials?: Testimonial[];
  onSave: (data: {
    card: BusinessCard;
    services: Service[];
    gallery: GalleryImage[];
    videos: Video[];
    testimonials: Testimonial[];
  }) => Promise<void>;
}

export default function CardForm({
  initialCard,
  initialServices = [],
  initialGallery = [],
  initialVideos = [],
  initialTestimonials = [],
  onSave
}: CardFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'branding' | 'services' | 'media' | 'testimonials'>('info');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('vcard_active_user');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    }
  }, []);

  // 1. Basic & Contact State
  const [businessName, setBusinessName] = useState(initialCard?.businessName || '');
  const [slug, setSlug] = useState(initialCard?.slug || '');
  const [ownerName, setOwnerName] = useState(initialCard?.ownerName || '');
  const [designation, setDesignation] = useState(initialCard?.designation || '');
  const [category, setCategory] = useState(initialCard?.category || '');
  const [description, setDescription] = useState(initialCard?.description || '');
  const [mobile, setMobile] = useState(initialCard?.mobile || '');
  const [whatsapp, setWhatsapp] = useState(initialCard?.whatsapp || '');
  const [alternateMobile, setAlternateMobile] = useState(initialCard?.alternateMobile || '');
  const [email, setEmail] = useState(initialCard?.email || '');
  const [website, setWebsite] = useState(initialCard?.website || '');
  const [address, setAddress] = useState(initialCard?.address || '');
  const [mapsLink, setMapsLink] = useState(initialCard?.mapsLink || '');
  
  // 2. Social State
  const [facebookUrl, setFacebookUrl] = useState(initialCard?.facebookUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(initialCard?.instagramUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(initialCard?.linkedinUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(initialCard?.youtubeUrl || '');
  const [telegramUrl, setTelegramUrl] = useState(initialCard?.telegramUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(initialCard?.twitterUrl || '');

  // 3. Branding & Template State
  const [profileImage, setProfileImage] = useState(initialCard?.profileImage || '');
  const [coverImage, setCoverImage] = useState(initialCard?.coverImage || '');
  const [logo, setLogo] = useState(initialCard?.logo || '');
  const [templateId, setTemplateId] = useState(initialCard?.templateId || 'template1');

  // 4. Repeating Lists State
  const [services, setServices] = useState<Service[]>(initialServices);
  const [gallery, setGallery] = useState<GalleryImage[]>(initialGallery);
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

  // Helper States for Adding Items
  const [newService, setNewService] = useState({ title: '', description: '', image: '' });
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newTestimonial, setNewTestimonial] = useState({ customerName: '', review: '', rating: 5, photo: '' });

  const [confirmDeleteType, setConfirmDeleteType] = useState<'service' | 'gallery' | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Auto-generate URL slug from Business Name in Create Mode
  useEffect(() => {
    if (!initialCard) {
      const generated = businessName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-')       // replace spaces with -
        .replace(/-+/g, '-');        // replace double -
      setSlug(generated);
    }
  }, [businessName, initialCard]);

  // Handle Dynamic List Additions
  const addService = () => {
    if (!newService.title || !newService.description) return;
    
    if (services.length >= PORTAL_LIMITS.MAX_SERVICES) {
      const errMsg = `You have reached the maximum limit of ${PORTAL_LIMITS.MAX_SERVICES} services. Please remove an existing service before adding a new one.`;
      setError(errMsg);
      alert(errMsg);
      return;
    }

    const item: Service = {
      id: `service_${Date.now()}`,
      businessId: initialCard?.id || slug,
      title: newService.title,
      description: newService.description,
      image: newService.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop'
    };
    setServices([...services, item]);
    setNewService({ title: '', description: '', image: '' });
    setError('');
  };

  const removeService = (id: string) => {
    setConfirmDeleteType('service');
    setDeleteTargetId(id);
  };

  const addGalleryImage = () => {
    if (!newGalleryUrl) return;

    if (gallery.length >= PORTAL_LIMITS.MAX_GALLERY_IMAGES) {
      const errMsg = `You have reached the maximum limit of ${PORTAL_LIMITS.MAX_GALLERY_IMAGES} gallery images.`;
      setError(errMsg);
      alert(errMsg);
      return;
    }

    const item: GalleryImage = {
      id: `gal_${Date.now()}`,
      businessId: initialCard?.id || slug,
      imageUrl: newGalleryUrl
    };
    setGallery([...gallery, item]);
    setNewGalleryUrl('');
    setError('');
  };

  const removeGalleryImage = (id: string) => {
    setConfirmDeleteType('gallery');
    setDeleteTargetId(id);
  };

  const executeDelete = () => {
    if (confirmDeleteType === 'service' && deleteTargetId) {
      setServices(services.filter(s => s.id !== deleteTargetId));
    } else if (confirmDeleteType === 'gallery' && deleteTargetId) {
      setGallery(gallery.filter(g => g.id !== deleteTargetId));
    }
    setConfirmDeleteType(null);
    setDeleteTargetId(null);
  };

  const addVideo = () => {
    if (!newVideoUrl) return;
    const item: Video = {
      id: `vid_${Date.now()}`,
      businessId: initialCard?.id || slug,
      youtubeUrl: newVideoUrl
    };
    setVideos([...videos, item]);
    setNewVideoUrl('');
  };

  const removeVideo = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
  };

  const addTestimonial = () => {
    if (!newTestimonial.customerName || !newTestimonial.review) return;
    const item: Testimonial = {
      id: `test_${Date.now()}`,
      businessId: initialCard?.id || slug,
      customerName: newTestimonial.customerName,
      review: newTestimonial.review,
      rating: newTestimonial.rating,
      photo: newTestimonial.photo || ""
    };
    setTestimonials([...testimonials, item]);
    setNewTestimonial({ customerName: '', review: '', rating: 5, photo: '' });
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!businessName || !slug || !ownerName || !mobile || !email) {
      setError('Please fill in all mandatory fields in Tab 1 (Core Info)');
      setActiveTab('info');
      return;
    }

    setLoading(true);
    try {
      const cardId = initialCard?.id || slug;
      
      let computedOwnerUid = initialCard?.ownerUid || '';
      let computedOwnerEmail = initialCard?.ownerEmail || '';

      if (currentUser?.role === 'super_admin' && !initialCard) {
        const finalOwnerEmail = ownerEmail || email;
        const finalOwnerPassword = ownerPassword || 'owner123';

        // Create Firebase Auth user if configured
        if (isFirebaseConfigured && auth) {
          try {
            const uid = await createFirebaseUser(finalOwnerEmail, finalOwnerPassword);
            computedOwnerUid = uid;
          } catch (e) {
            const errMsg = e instanceof Error ? e.message : String(e);
            setError(`Failed to create owner account in Firebase: ${errMsg}`);
            setLoading(false);
            return;
          }
        } else {
          // Fallback UID generation for mock mode
          computedOwnerUid = `owner_${Date.now()}`;
        }
        computedOwnerEmail = finalOwnerEmail;

        // Provision User Profile
        const ownerProfile: AppUser = {
          uid: computedOwnerUid,
          email: finalOwnerEmail,
          role: 'business_owner',
          businessId: cardId,
        };
        await dbService.saveUserProfile(ownerProfile);

        // Store bypass credentials in local storage only for mock mode
        if (!isFirebaseConfigured && typeof window !== 'undefined') {
          const localCreds = localStorage.getItem('vcard_local_credentials');
          const credentials = localCreds
            ? JSON.parse(localCreds)
            : [
                { email: 'admin@vcard.com', password: 'admin123', uid: 'mock-admin' },
                { email: 'apex@owner.com', password: 'owner123', uid: 'mock-owner-apex' },
              ];

          const existingIndex = credentials.findIndex(
            (c: { email: string; password: string; uid: string }) =>
              c.email.toLowerCase() === finalOwnerEmail.toLowerCase()
          );
          const credItem = { email: finalOwnerEmail, password: finalOwnerPassword, uid: computedOwnerUid };

          if (existingIndex > -1) {
            credentials[existingIndex] = credItem;
          } else {
            credentials.push(credItem);
          }
          localStorage.setItem('vcard_local_credentials', JSON.stringify(credentials));
        }
      }

      const cardData: BusinessCard = {
        id: cardId,
        businessName,
        slug,
        ownerName,
        designation,
        category,
        description,
        mobile,
        whatsapp,
        alternateMobile: alternateMobile || "",
        email,
        website: website || "",
        address: address || "",
        mapsLink: mapsLink || "",
        profileImage: profileImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        coverImage: coverImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop',
        logo: logo || "",
        createdAt: initialCard?.createdAt || new Date().toISOString(),
        facebookUrl: facebookUrl || "",
        instagramUrl: instagramUrl || "",
        linkedinUrl: linkedinUrl || "",
        youtubeUrl: youtubeUrl || "",
        telegramUrl: telegramUrl || "",
        twitterUrl: twitterUrl || "",
        templateId,
        ownerUid: computedOwnerUid,
        ownerEmail: computedOwnerEmail
      };

      // Correctly sync business ID of related elements if new slug is changed
      const finalServices = services.map(s => ({ ...s, businessId: cardData.id }));
      const finalGallery = gallery.map(g => ({ ...g, businessId: cardData.id }));
      const finalVideos = videos.map(v => ({ ...v, businessId: cardData.id }));
      const finalTestimonials = testimonials.map(t => ({ ...t, businessId: cardData.id }));

      await onSave({
        card: cardData,
        services: finalServices,
        gallery: finalGallery,
        videos: finalVideos,
        testimonials: finalTestimonials
      });
      
      if (currentUser?.role === 'business_owner') {
        router.push('/admin');
      } else {
        router.push('/admin/cards');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error occurred while saving digital card';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'info', name: '1. Core Info', icon: Info },
    { id: 'branding', name: '2. Branding & Layout', icon: ImageIcon },
    { id: 'services', name: '3. Services List', icon: Briefcase },
    { id: 'media', name: '4. Gallery & Media', icon: VideoIcon },
    { id: 'testimonials', name: '5. Reviews', icon: MessageSquare },
  ] as const;

  const templatesList = [
    { id: 'template1', name: 'Classic Professional', desc: 'Sleek, contact buttons at top. Perfect for Consultants & Doctors.' },
    { id: 'template2', name: 'Modern Business', desc: 'Bold tech panels & modern dark-mode chip accents. Ideal for Tech & Agencies.' },
    { id: 'template3', name: 'Portfolio Design', desc: 'Minimal visual style with massive masonry portfolio grid layouts.' },
    { id: 'template4', name: 'Store Layout', desc: 'Vibrant retail grids showcasing products with direct WhatsApp enquiry buttons.' },
    { id: 'template5', name: 'Premium Luxury', desc: 'Refined obsidian background with gold borders and elegant high-end typography.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/cards')}
          className="p-2.5 bg-white border border-slate-200 rounded-xl hover:border-slate-350 text-slate-500 hover:text-slate-800 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-left">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            {initialCard ? `Configure ${businessName}` : 'Build New Digital Card'}
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Fill in business profiles across sections, select templates, and launch.
          </p>
        </div>
      </div>

      {/* Tabs Panel */}
      <div className="flex overflow-x-auto border-b border-slate-200 gap-2 pb-1 scrollbar-thin">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-black whitespace-nowrap rounded-t-xl transition-all border-b-2 ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold text-left">
          {error}
        </div>
      )}

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
        
        {/* ==================================================== */}
        {/* TAB 1: CORE INFO & CONTACTS */}
        {/* ==================================================== */}
        {activeTab === 'info' && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Business Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Mahalakshmi Services"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">URL Slug (Auto Generated) *</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-xs font-bold text-slate-400">/</span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      placeholder="mahalakshmi-services"
                      className="w-full pl-7 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Owner Name *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="M. Mahalakshmi"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Owner Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Senior Insurance Consultant"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest pl-1">Business Category *</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Insurance & Home Loans"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Business Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief elegant overview of your products, brand, or mission..."
                    className="px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium resize-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest pl-1">WhatsApp Number *</label>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Alternate Mobile</label>
                  <input
                    type="text"
                    value={alternateMobile}
                    onChange={(e) => setAlternateMobile(e.target.value)}
                    placeholder="+91 87654 32109"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!initialCard && (ownerEmail === '' || ownerEmail === email)) {
                        setOwnerEmail(e.target.value);
                      }
                    }}
                    placeholder="info@mahalakshmiservices.com"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://mahalakshmiservices.com"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Google Maps Link</label>
                  <input
                    type="url"
                    value={mapsLink}
                    onChange={(e) => setMapsLink(e.target.value)}
                    placeholder="https://goo.gl/maps/..."
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Physical Address</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Suite 104, MG Road, Bangalore - 560001"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Sub-section */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1 flex items-center gap-1.5"><FacebookIcon /> Facebook URL</label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/brand"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1 flex items-center gap-1.5"><InstagramIcon /> Instagram URL</label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/brand"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1 flex items-center gap-1.5"><LinkedinIcon /> LinkedIn URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/profile"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1 flex items-center gap-1.5"><YoutubeIcon /> YouTube Channel</label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/c/channel"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1 flex items-center gap-1.5"><TelegramIcon /> Telegram URL</label>
                  <input
                    type="url"
                    value={telegramUrl}
                    onChange={(e) => setTelegramUrl(e.target.value)}
                    placeholder="https://t.me/username"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1 flex items-center gap-1.5"><TwitterIcon /> Twitter/X URL</label>
                  <input
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="px-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-350 focus:bg-white focus:border-indigo-500 focus:outline-none rounded-xl text-xs transition-all text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Owner Account Creation Settings - Only visible for Super Admin during card creation */}
            {currentUser?.role === 'super_admin' && !initialCard && (
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-4 text-left">
                <div className="flex items-center gap-2 text-indigo-700 border-b border-indigo-100 pb-2">
                  <Settings className="w-5 h-5" />
                  <h3 className="text-base font-extrabold text-slate-900">Owner Account Provisioning</h3>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Provision a dedicated login credential for this business owner. They will be restricted to managing ONLY this card, its services, and inquiries.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Owner Login Email *</label>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="owner@domain.com"
                      className="px-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 font-medium"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-1">Owner Password *</label>
                    <input
                      type="password"
                      required
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="px-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: BRANDING & TEMPLATE LAYOUT */}
        {/* ==================================================== */}
        {activeTab === 'branding' && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Branding Assets</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <ImageUpload
                  label="Profile Photo"
                  value={profileImage}
                  onChange={setProfileImage}
                  onRemove={() => setProfileImage('')}
                  aspectRatio="avatar"
                />

                <ImageUpload
                  label="Cover Banner"
                  value={coverImage}
                  onChange={setCoverImage}
                  onRemove={() => setCoverImage('')}
                  aspectRatio="banner"
                />

                <ImageUpload
                  label="Company Logo"
                  value={logo}
                  onChange={setLogo}
                  onRemove={() => setLogo('')}
                  aspectRatio="square"
                />
              </div>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Choose Template</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {templatesList.map((tpl) => {
                  const isSelected = templateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplateId(tpl.id)}
                      className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-40 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-slate-200 bg-slate-50 hover:border-slate-350 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-900'}`}>
                            {tpl.name}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold">
                          {tpl.desc}
                        </p>
                      </div>

                      <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-indigo-700' : 'text-slate-400'}`}>
                        {isSelected ? 'Active Template' : 'Select Layout'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: SERVICES MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Manage Services</h3>
              <p className="text-slate-500 text-xs -mt-2 mb-6 font-medium">Add products, services, or portfolios that this card will showcase.</p>
              
              {/* Form to Add New Service */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 mb-8">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-widest block mb-1">
                  Add New Item
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-0.5">Service Title</label>
                    <input
                      type="text"
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      placeholder="Life Insurance"
                      className="px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <ImageUpload
                      label="Service Image (Optional)"
                      value={newService.image}
                      onChange={(url) => setNewService({ ...newService, image: url })}
                      onRemove={() => setNewService({ ...newService, image: '' })}
                      aspectRatio="square"
                    />
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-450 uppercase tracking-widest pl-0.5">Service Description</label>
                    <textarea
                      rows={2}
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      placeholder="Give a beautiful, short summary explaining features or deliverables..."
                      className="px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 self-start shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Append Service
                </button>
              </div>

              {/* Rendered Services List */}
              <div className="space-y-4 bg-slate-50 p-5 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 pl-1 gap-4">
                  <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">
                    Active Services Catalog
                  </span>
                  <span className="text-[10px] font-black text-indigo-700 whitespace-nowrap bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Services Used: {services.length} / {PORTAL_LIMITS.MAX_SERVICES}
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                  <div 
                    className="bg-indigo-650 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (services.length / PORTAL_LIMITS.MAX_SERVICES) * 100)}%` }}
                  />
                </div>
                
                {services.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs font-semibold">
                    No services appended yet. Add services above to show them in the card templates!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {services.map((item, idx) => (
                      <div 
                        key={item.id}
                        className="p-4 bg-white border border-slate-200 rounded-2xl flex gap-3 items-start justify-between group"
                      >
                        <div className="flex gap-3 min-w-0">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0">
                            <span className="block text-sm font-bold text-slate-900 truncate">
                              {item.title}
                            </span>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-medium">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeService(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: GALLERY & OTHER MEDIA */}
        {/* ==================================================== */}
        {activeTab === 'media' && (
          <div className="space-y-8 animate-fadeIn text-left">
            {/* Gallery Images Section */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Gallery Images</h3>
              <p className="text-slate-500 text-xs -mt-2 mb-6 font-medium">Add photographs of products, certificate accomplishments, office, or team.</p>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 mb-8">
                <ImageUpload
                  label="Upload New Gallery Photo"
                  value={newGalleryUrl}
                  onChange={setNewGalleryUrl}
                  onRemove={() => setNewGalleryUrl('')}
                  aspectRatio="video"
                />
                <button
                  type="button"
                  onClick={addGalleryImage}
                  disabled={!newGalleryUrl}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-755 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 self-start shadow-sm"
                >
                  <Plus className="w-4.5 h-4.5" />
                  Add Photo to Gallery
                </button>
              </div>

              {/* Render Gallery */}
              <div className="space-y-4 bg-slate-50 p-5 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 pl-1 gap-4">
                  <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">
                    Active Gallery Photos
                  </span>
                  <span className="text-[10px] font-black text-indigo-700 whitespace-nowrap bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    Gallery Images Used: {gallery.length} / {PORTAL_LIMITS.MAX_GALLERY_IMAGES}
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-slate-300">
                  <div 
                    className="bg-indigo-650 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (gallery.length / PORTAL_LIMITS.MAX_GALLERY_IMAGES) * 100)}%` }}
                  />
                </div>
                
                {gallery.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs font-semibold">
                    No gallery images appended yet.
                  </div>
                ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                  {gallery.map((img) => (
                    <div 
                      key={img.id}
                      className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group aspect-video"
                    >
                      <img 
                        src={img.imageUrl} 
                        alt="Gallery" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(img.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white/95 hover:bg-rose-600 text-slate-500 hover:text-white rounded-lg transition-colors border border-slate-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>

            {/* YouTube Videos Section */}
            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Embedded YouTube Videos</h3>
              <p className="text-slate-500 text-xs -mt-2 mb-6 font-medium">Attach corporate commercials, testimonial video logs, or promotional videos.</p>

              <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-8">
                <input
                  type="url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="Paste YouTube Video URL (e.g. https://www.youtube.com/watch?v=...)"
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800"
                />
                <button
                  type="button"
                  onClick={addVideo}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4.5 h-4.5" />
                  Add Video
                </button>
              </div>

              {/* Render videos */}
              {videos.length === 0 ? (
                <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs font-semibold">
                  No video embeds appended yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.map((vid) => (
                    <div 
                      key={vid.id}
                      className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <YoutubeIcon />
                        <span className="truncate text-slate-700 font-semibold">{vid.youtubeUrl}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(vid.id)}
                        className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: TESTIMONIALS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 animate-fadeIn text-left">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2 mb-4">Customer Testimonials</h3>
              <p className="text-slate-500 text-xs -mt-2 mb-6 font-medium">Feature reviews from top clients to establish massive brand credibility.</p>

              {/* Add testimonial form */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 mb-8">
                <span className="text-xs font-black text-indigo-700 uppercase tracking-widest block mb-1">
                  Add New Review
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest pl-0.5">Customer Name</label>
                    <input
                      type="text"
                      value={newTestimonial.customerName}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, customerName: e.target.value })}
                      placeholder="Rajesh Subramanian"
                      className="px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <ImageUpload
                      label="Customer Avatar Photo"
                      value={newTestimonial.photo}
                      onChange={(url) => setNewTestimonial({ ...newTestimonial, photo: url })}
                      onRemove={() => setNewTestimonial({ ...newTestimonial, photo: '' })}
                      aspectRatio="avatar"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest pl-0.5">Rating (1-5 Stars)</label>
                    <div className="flex items-center gap-1.5 h-10 pl-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewTestimonial({ ...newTestimonial, rating: star })}
                          className="text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${newTestimonial.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 md:col-span-3">
                    <label className="text-[10px] font-black text-slate-455 uppercase tracking-widest pl-0.5">Customer Review Feedback</label>
                    <textarea
                      rows={2}
                      value={newTestimonial.review}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                      placeholder="Write the recommendation or feedback statement..."
                      className="px-4 py-2.5 bg-white border border-slate-200 focus:border-indigo-500 focus:outline-none rounded-xl text-xs text-slate-800 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addTestimonial}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 self-start shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Append Review
                </button>
              </div>

              {/* Render testimonials */}
              <div className="space-y-4">
                <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block pl-1">
                  Active Reviews List ({testimonials.length})
                </span>

                {testimonials.length === 0 ? (
                  <div className="p-8 text-center bg-white border border-dashed border-slate-200 rounded-2xl text-slate-500 text-xs font-semibold">
                    No recommendations or reviews added yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testimonials.map((item) => (
                      <div 
                        key={item.id}
                        className="p-4 bg-white border border-slate-200 rounded-2xl flex gap-3 items-start justify-between"
                      >
                        <div className="flex gap-3 min-w-0">
                          {item.photo ? (
                            <img 
                              src={item.photo} 
                              alt={item.customerName}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-50 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-indigo-650 flex-shrink-0 border border-slate-200">
                              {item.customerName.charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0 space-y-1">
                            <span className="block text-xs font-bold text-slate-900 truncate">
                              {item.customerName}
                            </span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                            <p className="text-xs text-slate-550 italic font-medium leading-relaxed">
                              &ldquo;{item.review}&rdquo;
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTestimonial(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* ==================================================== */}
        {/* SUBMIT BUTTON SECTION FOOTER */}
        {/* ==================================================== */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500 font-semibold italic text-left">
            * Tab 1 Core Info is mandatory to save your VCard.
          </span>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl text-xs font-black shadow-sm transition-all flex items-center gap-2 hover:scale-[1.01] disabled:opacity-50"
          >
            <Save className="w-4.5 h-4.5" />
            {loading ? 'Committing Changes...' : 'Save Digital Card'}
          </button>
        </div>

      </form>

      {/* Premium Glassmorphic Delete Confirmation Dialog */}
      {confirmDeleteType && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl space-y-4 text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="text-lg font-extrabold text-slate-900 font-sans">Confirm Deletion</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-sans font-medium">
              Are you sure you want to delete this {confirmDeleteType === 'service' ? 'service catalog item' : 'gallery image'}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmDeleteType(null);
                  setDeleteTargetId(null);
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all font-sans"
              >
                No, Keep It
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all shadow-sm font-sans"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
