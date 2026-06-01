import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { BusinessCard, Service, GalleryImage, Video, Testimonial, Lead, AnalyticsEntry, AppUser } from '../types';
import { PORTAL_LIMITS } from './constants';

// ==========================================
// PREPOPULATED RICH MOCK DATA FOR FALLBACK
// ==========================================
const MOCK_CARDS: BusinessCard[] = [
  {
    id: 'mahalakshmi-services',
    businessName: 'Mahalakshmi Services',
    slug: 'mahalakshmi-services',
    ownerName: 'M. Mahalakshmi',
    designation: 'Senior Insurance Consultant',
    category: 'Insurance & Home Loans',
    description: 'We offer specialized, personalized advisory services for all types of Life Insurance, Health Insurance, Vehicle Insurance, and customized Home Loan assistance to protect your family\'s financial future.',
    templateId: 'template1', // Classic Professional
    mobile: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    alternateMobile: '+91 87654 32109',
    email: 'info@mahalakshmiservices.com',
    website: 'https://mahalakshmiservices.com',
    address: 'Suite 104, Royal Palms Plaza, MG Road, Bangalore - 560001',
    mapsLink: 'https://maps.google.com',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop',
    createdAt: new Date('2026-05-15T09:00:00Z').toISOString(),
    facebookUrl: 'https://facebook.com',
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://twitter.com'
  },
  {
    id: 'apex-digital-studio',
    businessName: 'Apex Digital Studio',
    slug: 'apex-digital-studio',
    ownerName: 'Rohan Sharma',
    designation: 'Creative Director',
    category: 'IT & Digital Marketing Agency',
    description: 'Apex Digital Studio is a premier, full-stack digital marketing and creative agency. We build bespoke next-generation web apps, run conversion-oriented paid campaigns, and craft premium branding identities.',
    templateId: 'template2', // Modern Business
    mobile: '+91 99999 88888',
    whatsapp: '+91 99999 88888',
    email: 'hello@apexdigital.studio',
    website: 'https://apexdigital.studio',
    address: '4th Floor, Tech Hub Towers, Sector 62, Noida - 201301',
    mapsLink: 'https://maps.google.com',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop',
    createdAt: new Date('2026-05-18T10:30:00Z').toISOString(),
    facebookUrl: 'https://facebook.com',
    linkedinUrl: 'https://linkedin.com',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    ownerUid: 'mock-owner-apex',
    ownerEmail: 'apex@owner.com'
  },
  {
    id: 'studio-craft-architects',
    businessName: 'Studio Craft Architects',
    slug: 'studio-craft-architects',
    ownerName: 'Ananya Verma',
    designation: 'Principal Architect & Founder',
    category: 'Architecture & Interior Design',
    description: 'Studio Craft Architects is an award-winning architectural atelier based in Mumbai. We shape high-end luxury residential projects, commercial office layouts, and sustainable green buildings.',
    templateId: 'template3', // Portfolio Design
    mobile: '+91 98888 77777',
    whatsapp: '+91 98888 77777',
    email: 'contact@studiocraft.arch',
    website: 'https://studiocraft.arch',
    address: 'Bungalow 12, Coastal Road, Juhu, Mumbai - 400049',
    mapsLink: 'https://maps.google.com',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=150&h=150&fit=crop',
    createdAt: new Date('2026-05-20T14:15:00Z').toISOString(),
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com'
  },
  {
    id: 'traditional-saree-palace',
    businessName: 'Traditional Saree Palace',
    slug: 'traditional-saree-palace',
    ownerName: 'Priya Kothari',
    designation: 'Managing Partner',
    category: 'Bridal & Premium Retail Silks',
    description: 'Traditional Saree Palace is a legacy heritage store bringing you handpicked, pure Banarasi, Kanchipuram silk, and designer bridal sarees, woven by expert master weavers for your special moments.',
    templateId: 'template4', // Store Layout
    mobile: '+91 91111 22222',
    whatsapp: '+91 91111 22222',
    alternateMobile: '+91 93333 44444',
    email: 'orders@traditionalsareepalace.com',
    website: 'https://traditionalsareepalace.com',
    address: 'No 45, Chickpet Main Road, Bengaluru - 560053',
    mapsLink: 'https://maps.google.com',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=150&h=150&fit=crop',
    createdAt: new Date('2026-05-22T08:45:00Z').toISOString(),
    instagramUrl: 'https://instagram.com',
    facebookUrl: 'https://facebook.com'
  },
  {
    id: 'elite-real-estate-group',
    businessName: 'Elite Real Estate Group',
    slug: 'elite-real-estate-group',
    ownerName: 'Vikram Malhotra',
    designation: 'Managing Director',
    category: 'Ultra-Luxury Properties',
    description: 'Elite Real Estate Group specializes in sourcing, brokering, and advising on multi-million dollar luxury estates, seafront penthouses, and private golf villas across the country\'s most prestigious postcodes.',
    templateId: 'template5', // Premium Luxury
    mobile: '+91 90000 11111',
    whatsapp: '+91 90000 11111',
    email: 'vikram@eliterealestate.group',
    website: 'https://eliterealestate.group',
    address: 'Level 15, Signature Towers, BKC, Mumbai - 400051',
    mapsLink: 'https://maps.google.com',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=400&fit=crop',
    logo: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=150&h=150&fit=crop',
    createdAt: new Date('2026-05-25T11:20:00Z').toISOString(),
    linkedinUrl: 'https://linkedin.com',
    twitterUrl: 'https://twitter.com'
  }
];

const MOCK_SERVICES: Service[] = [
  // Mahalakshmi Services
  { id: 'ms1', businessId: 'mahalakshmi-services', title: 'Life Insurance', description: 'Comprehensive term plans and retirement security programs for complete peace of mind.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&h=200&fit=crop' },
  { id: 'ms2', businessId: 'mahalakshmi-services', title: 'Health Insurance', description: 'Top-tier medical coverage and cashless hospitalization for you and your family.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=300&h=200&fit=crop' },
  { id: 'ms3', businessId: 'mahalakshmi-services', title: 'Vehicle Insurance', description: 'Quick claim settlements and low premiums for two-wheelers and commercial cars.', image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&h=200&fit=crop' },
  { id: 'ms4', businessId: 'mahalakshmi-services', title: 'Home Loans Support', description: 'Get maximum eligibility, low interest rates, and minimal documentation assistance.', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop' },

  // Apex Digital Studio
  { id: 'ads1', businessId: 'apex-digital-studio', title: 'Bespoke Web Development', description: 'High-performance Next.js and custom full-stack solutions built for speed and conversions.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop' },
  { id: 'ads2', businessId: 'apex-digital-studio', title: 'Paid Ad Campaigns', description: 'High-ROI Google, Meta, and LinkedIn ad accounts managed by veteran performance marketers.', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=300&h=200&fit=crop' },
  { id: 'ads3', businessId: 'apex-digital-studio', title: 'Creative Brand Identities', description: 'Stunning visual languages, logos, custom guidelines, and user interfaces that pop out.', image: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=300&h=200&fit=crop' },

  // Studio Craft
  { id: 'sca1', businessId: 'studio-craft-architects', title: 'Luxury Villa Design', description: 'Crafting beautiful, modern private residential estates integrated with nature.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop' },
  { id: 'sca2', businessId: 'studio-craft-architects', title: 'Commercial Office Space', description: 'Designing open, ergonomic workspaces that spark collaboration and employee productivity.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop' },

  // Saree Palace
  { id: 'tsp1', businessId: 'traditional-saree-palace', title: 'Pure Kanchipuram Silks', description: 'Brilliant heavy gold zari brocades and handwoven bridal sarees of legendary weight and shine.', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&h=200&fit=crop' },
  { id: 'tsp2', businessId: 'traditional-saree-palace', title: 'Designer Bridal Lehengas', description: 'Custom fit, intricate hand-embellished zari and stone-work lehengas for high-glamour weddings.', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&h=200&fit=crop' },

  // Elite Real Estate
  { id: 'ere1', businessId: 'elite-real-estate-group', title: 'Seafront Penthouses', description: 'Private, high-security, luxury high-rise residencies with infinite horizon ocean views.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=200&fit=crop' },
  { id: 'ere2', businessId: 'elite-real-estate-group', title: 'Heritage Land Portfolios', description: 'Exclusive investment-grade land acquisitions in highly desirable development sectors.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop' }
];

const MOCK_GALLERY: GalleryImage[] = [
  { id: 'g1', businessId: 'mahalakshmi-services', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=450&fit=crop' },
  { id: 'g2', businessId: 'mahalakshmi-services', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=450&fit=crop' },
  { id: 'g3', businessId: 'apex-digital-studio', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=450&fit=crop' },
  { id: 'g4', businessId: 'apex-digital-studio', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop' },
  { id: 'g5', businessId: 'studio-craft-architects', imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=450&fit=crop' },
  { id: 'g6', businessId: 'studio-craft-architects', imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&h=450&fit=crop' },
  { id: 'g7', businessId: 'traditional-saree-palace', imageUrl: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=600&h=450&fit=crop' },
  { id: 'g8', businessId: 'traditional-saree-palace', imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&h=450&fit=crop' },
  { id: 'g9', businessId: 'elite-real-estate-group', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=450&fit=crop' },
  { id: 'g10', businessId: 'elite-real-estate-group', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=450&fit=crop' }
];

const MOCK_VIDEOS: Video[] = [
  { id: 'v1', businessId: 'mahalakshmi-services', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { id: 'v2', businessId: 'apex-digital-studio', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
];

const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: 't1', businessId: 'mahalakshmi-services', customerName: 'Rajesh Subramanian', review: 'Mahalakshmi services made my home loan process completely stress-free. Very quick approvals and honest rates.', rating: 5, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 't2', businessId: 'mahalakshmi-services', customerName: 'Deepa Krishnan', review: 'Extremely professional insurance guidance. Highly recommended senior advisor.', rating: 5 },
  { id: 't3', businessId: 'apex-digital-studio', customerName: 'Sanjay Dutt', review: 'They completely overhauled our software platform and grew our digital leads by 300%. Brilliant developers.', rating: 5, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { id: 't4', businessId: 'studio-craft-architects', customerName: 'Dr. Meera Patel', review: 'Ananya designed our luxury seafront duplex villa. Her attention to ventilation and light is pure magic.', rating: 5, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 't5', businessId: 'traditional-saree-palace', customerName: 'Saritha Nair', review: 'The wedding silk shopping experience was incredible. They gave us exclusive designs not found elsewhere.', rating: 5 },
  { id: 't6', businessId: 'elite-real-estate-group', customerName: 'Alok Khandelwal', review: 'Vikram secured a fantastic sea-facing penthouse in Worli for our family. Exceptional discretion and service.', rating: 5, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' }
];

const MOCK_LEADS: Lead[] = [
  { id: 'l1', businessId: 'mahalakshmi-services', name: 'Karthik Rao', mobile: '9988776655', email: 'karthik@gmail.com', message: 'Looking for a home loan of 75 Lakhs. Please call me back.', createdAt: new Date('2026-05-30T10:00:00Z').toISOString() },
  { id: 'l2', businessId: 'mahalakshmi-services', name: 'Nisha Hegde', mobile: '9876598765', email: 'nisha@gmail.com', message: 'Want to compare health insurance plans for elderly parents.', createdAt: new Date('2026-05-31T11:20:00Z').toISOString() },
  { id: 'l3', businessId: 'apex-digital-studio', name: 'Rahul Varma', mobile: '9999911111', email: 'rahul@varma.co', message: 'Need quotation for a mobile application and landing page design.', createdAt: new Date('2026-05-31T14:40:00Z').toISOString() }
];

const MOCK_ANALYTICS: AnalyticsEntry[] = [
  { id: 'a1', businessId: 'mahalakshmi-services', eventType: 'view', createdAt: new Date('2026-05-30T09:00:00Z').toISOString() },
  { id: 'a2', businessId: 'mahalakshmi-services', eventType: 'click_call', createdAt: new Date('2026-05-30T10:05:00Z').toISOString() },
  { id: 'a3', businessId: 'mahalakshmi-services', eventType: 'click_whatsapp', createdAt: new Date('2026-05-30T10:10:00Z').toISOString() },
  { id: 'a4', businessId: 'mahalakshmi-services', eventType: 'click_vcf', createdAt: new Date('2026-05-31T08:15:00Z').toISOString() },
  { id: 'a5', businessId: 'mahalakshmi-services', eventType: 'view', createdAt: new Date('2026-05-31T09:30:00Z').toISOString() },
  { id: 'a6', businessId: 'apex-digital-studio', eventType: 'view', createdAt: new Date('2026-05-31T10:00:00Z').toISOString() },
  { id: 'a7', businessId: 'studio-craft-architects', eventType: 'view', createdAt: new Date('2026-05-31T12:00:00Z').toISOString() },
  { id: 'a8', businessId: 'traditional-saree-palace', eventType: 'view', createdAt: new Date('2026-05-31T14:00:00Z').toISOString() },
  { id: 'a9', businessId: 'elite-real-estate-group', eventType: 'view', createdAt: new Date('2026-06-01T08:00:00Z').toISOString() }
];

export const MOCK_USERS: AppUser[] = [
  {
    uid: 'mock-admin',
    email: 'admin@vcard.com',
    role: 'super_admin'
  },
  {
    uid: 'mock-owner-apex',
    email: 'apex@owner.com',
    role: 'business_owner',
    businessId: 'apex-digital-studio'
  }
];

// Helper to access LocalStorage safely
const getLocalData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// ==========================================
// UNIFIED DATA SERVICES (FIRESTORE / FALLBACK)
// ==========================================

export const dbService = {
  // Scoped authorization check for multi-tenant protection (Defense-in-depth)
  _authorizeTenant(businessId: string): void {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('vcard_active_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.role === 'business_owner' && u.businessId !== businessId) {
          throw new Error(`Security Violation: Unauthorized operation. You cannot modify card details for: "${businessId}".`);
        }
      }
    }
  },

  // USER PROFILES & ACCOUNTS
  async getUserProfile(uid: string): Promise<AppUser | null> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { uid: docSnap.id, ...docSnap.data() } as AppUser;
        }
        return null;
      } catch (err) {
        console.error('Firebase user read failed', err);
      }
    }
    const users = getLocalData<AppUser[]>('vcard_users', MOCK_USERS);
    return users.find(u => u.uid === uid) || null;
  },

  async saveUserProfile(user: AppUser): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, user);
        return;
      } catch (err) {
        console.error('Firebase user save failed', err);
      }
    }
    const users = getLocalData<AppUser[]>('vcard_users', MOCK_USERS);
    const existingIndex = users.findIndex(u => u.uid === user.uid);
    if (existingIndex > -1) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    setLocalData('vcard_users', users);
  },

  // BUSINESS CARDS
  async getBusinesses(ownerUid?: string): Promise<BusinessCard[]> {
    if (isFirebaseConfigured && db) {
      try {
        const colRef = collection(db, 'businesses');
        const q = ownerUid
          ? query(colRef, where('ownerUid', '==', ownerUid))
          : query(colRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const results = snap.docs.map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            status: 'active' as const,
            ownerPassword: 'owner123',
            ...data 
          } as BusinessCard;
        });
        if (ownerUid) {
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return results;
      } catch (err) {
        console.error('Firebase read failed, using fallback', err);
      }
    }
    const cards = getLocalData<BusinessCard[]>('vcard_businesses', MOCK_CARDS);
    const populated = cards.map(c => ({
      status: 'active' as const,
      ownerPassword: 'owner123',
      ...c
    }));
    const sorted = [...populated].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (ownerUid) {
      return sorted.filter(c => c.ownerUid === ownerUid);
    }
    return sorted;
  },

  async getBusinessBySlug(slug: string): Promise<BusinessCard | null> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'businesses'), where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docItem = snap.docs[0];
          return { id: docItem.id, status: 'active' as const, ownerPassword: 'owner123', ...docItem.data() } as BusinessCard;
        }
        return null;
      } catch (err) {
        console.error('Firebase read failed, using fallback', err);
      }
    }
    const cards = getLocalData<BusinessCard[]>('vcard_businesses', MOCK_CARDS);
    const matched = cards.find(c => c.slug === slug);
    if (matched) {
      return { status: 'active', ownerPassword: 'owner123', ...matched };
    }
    return null;
  },

  async getBusinessById(id: string): Promise<BusinessCard | null> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'businesses', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, status: 'active', ownerPassword: 'owner123', ...docSnap.data() } as BusinessCard;
        }
        return null;
      } catch (err) {
        console.error('Firebase read failed, using fallback', err);
      }
    }
    const cards = getLocalData<BusinessCard[]>('vcard_businesses', MOCK_CARDS);
    const matched = cards.find(c => c.id === id);
    if (matched) {
      return { status: 'active', ownerPassword: 'owner123', ...matched };
    }
    return null;
  },

  async toggleBusinessStatus(cardId: string, newStatus: 'active' | 'inactive'): Promise<void> {
    const card = await this.getBusinessById(cardId);
    if (card) {
      card.status = newStatus;
      await this.saveBusiness(card);
    }
  },

  async resetOwnerPassword(cardId: string, newPassword: string): Promise<void> {
    const card = await this.getBusinessById(cardId);
    if (card) {
      card.ownerPassword = newPassword;
      await this.saveBusiness(card);
      
      // Update local storage credentials bypass list for immediate login capability
      if (typeof window !== 'undefined') {
        const localCreds = localStorage.getItem('vcard_local_credentials');
        if (localCreds && card.ownerEmail) {
          const credentials = JSON.parse(localCreds);
          const idx = credentials.findIndex(
            (c: { email: string; password: string }) => c.email.toLowerCase() === card.ownerEmail?.toLowerCase()
          );
          if (idx > -1) {
            credentials[idx].password = newPassword;
            localStorage.setItem('vcard_local_credentials', JSON.stringify(credentials));
          }
        }
      }
    }
  },

  async saveBusiness(card: BusinessCard): Promise<void> {
    this._authorizeTenant(card.id);
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'businesses', card.id);
        await setDoc(docRef, card);
        return;
      } catch (err) {
        console.error('Firebase save failed, using fallback', err);
      }
    }
    const cards = getLocalData<BusinessCard[]>('vcard_businesses', MOCK_CARDS);
    const existingIndex = cards.findIndex(c => c.id === card.id);
    if (existingIndex > -1) {
      cards[existingIndex] = card;
    } else {
      cards.push(card);
    }
    setLocalData('vcard_businesses', cards);
  },

  async deleteBusiness(id: string): Promise<void> {
    this._authorizeTenant(id);
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'businesses', id));
        // Delete related services, gallery images, videos, testimonials, leads, analytics
        // (In professional apps, this is run either as a transaction or cloud function)
        return;
      } catch (err) {
        console.error('Firebase delete failed, using fallback', err);
      }
    }
    // Fallback delete
    const cards = getLocalData('vcard_businesses', MOCK_CARDS).filter(c => c.id !== id);
    setLocalData('vcard_businesses', cards);

    const services = getLocalData('vcard_services', MOCK_SERVICES).filter(s => s.businessId !== id);
    setLocalData('vcard_services', services);

    const gallery = getLocalData('vcard_gallery', MOCK_GALLERY).filter(g => g.businessId !== id);
    setLocalData('vcard_gallery', gallery);

    const videos = getLocalData('vcard_videos', MOCK_VIDEOS).filter(v => v.businessId !== id);
    setLocalData('vcard_videos', videos);

    const testimonials = getLocalData('vcard_testimonials', MOCK_TESTIMONIALS).filter(t => t.businessId !== id);
    setLocalData('vcard_testimonials', testimonials);

    const leads = getLocalData('vcard_leads', MOCK_LEADS).filter(l => l.businessId !== id);
    setLocalData('vcard_leads', leads);

    const analytics = getLocalData('vcard_analytics', MOCK_ANALYTICS).filter(a => a.businessId !== id);
    setLocalData('vcard_analytics', analytics);
  },

  // SERVICES
  async getServices(businessId: string): Promise<Service[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'services'), where('businessId', '==', businessId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      } catch (err) {
        console.error('Firebase services read failed, using fallback', err);
      }
    }
    const services = getLocalData('vcard_services', MOCK_SERVICES);
    return services.filter(s => s.businessId === businessId);
  },

  async saveServices(businessId: string, services: Service[]): Promise<void> {
    this._authorizeTenant(businessId);
    if (services.length > PORTAL_LIMITS.MAX_SERVICES) {
      throw new Error(`You have reached the maximum limit of ${PORTAL_LIMITS.MAX_SERVICES} services. Please remove an existing service before adding a new one.`);
    }

    if (isFirebaseConfigured && db) {
      try {
        // Simple strategy: delete existing and write new ones to mimic sync
        const q = query(collection(db, 'services'), where('businessId', '==', businessId));
        const snap = await getDocs(q);
        for (const snapDoc of snap.docs) {
          await deleteDoc(doc(db, 'services', snapDoc.id));
        }
        for (const s of services) {
          await setDoc(doc(db, 'services', s.id), s);
        }
        return;
      } catch (err) {
        console.error('Firebase services save failed, using fallback', err);
      }
    }
    const allServices = getLocalData('vcard_services', MOCK_SERVICES).filter(s => s.businessId !== businessId);
    allServices.push(...services);
    setLocalData('vcard_services', allServices);
  },

  // GALLERY IMAGES
  async getGalleryImages(businessId: string): Promise<GalleryImage[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'gallery'), where('businessId', '==', businessId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage));
      } catch (err) {
        console.error('Firebase gallery read failed, using fallback', err);
      }
    }
    const gallery = getLocalData('vcard_gallery', MOCK_GALLERY);
    return gallery.filter(g => g.businessId === businessId);
  },

  async saveGalleryImages(businessId: string, images: GalleryImage[]): Promise<void> {
    this._authorizeTenant(businessId);
    if (images.length > PORTAL_LIMITS.MAX_GALLERY_IMAGES) {
      throw new Error(`You have reached the maximum limit of ${PORTAL_LIMITS.MAX_GALLERY_IMAGES} gallery images.`);
    }

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'gallery'), where('businessId', '==', businessId));
        const snap = await getDocs(q);
        for (const snapDoc of snap.docs) {
          await deleteDoc(doc(db, 'gallery', snapDoc.id));
        }
        for (const img of images) {
          await setDoc(doc(db, 'gallery', img.id), img);
        }
        return;
      } catch (err) {
        console.error('Firebase gallery save failed, using fallback', err);
      }
    }
    const allGallery = getLocalData('vcard_gallery', MOCK_GALLERY).filter(g => g.businessId !== businessId);
    allGallery.push(...images);
    setLocalData('vcard_gallery', allGallery);
  },

  // VIDEOS
  async getVideos(businessId: string): Promise<Video[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'videos'), where('businessId', '==', businessId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
      } catch (err) {
        console.error('Firebase videos read failed, using fallback', err);
      }
    }
    const videos = getLocalData('vcard_videos', MOCK_VIDEOS);
    return videos.filter(v => v.businessId === businessId);
  },

  async saveVideos(businessId: string, videos: Video[]): Promise<void> {
    this._authorizeTenant(businessId);
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'videos'), where('businessId', '==', businessId));
        const snap = await getDocs(q);
        for (const snapDoc of snap.docs) {
          await deleteDoc(doc(db, 'videos', snapDoc.id));
        }
        for (const v of videos) {
          await setDoc(doc(db, 'videos', v.id), v);
        }
        return;
      } catch (err) {
        console.error('Firebase videos save failed, using fallback', err);
      }
    }
    const allVideos = getLocalData('vcard_videos', MOCK_VIDEOS).filter(v => v.businessId !== businessId);
    allVideos.push(...videos);
    setLocalData('vcard_videos', allVideos);
  },

  // TESTIMONIALS
  async getTestimonials(businessId: string): Promise<Testimonial[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'testimonials'), where('businessId', '==', businessId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
      } catch (err) {
        console.error('Firebase testimonials read failed, using fallback', err);
      }
    }
    const testimonials = getLocalData('vcard_testimonials', MOCK_TESTIMONIALS);
    return testimonials.filter(t => t.businessId === businessId);
  },

  async saveTestimonials(businessId: string, testimonials: Testimonial[]): Promise<void> {
    this._authorizeTenant(businessId);
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'testimonials'), where('businessId', '==', businessId));
        const snap = await getDocs(q);
        for (const snapDoc of snap.docs) {
          await deleteDoc(doc(db, 'testimonials', snapDoc.id));
        }
        for (const t of testimonials) {
          await setDoc(doc(db, 'testimonials', t.id), t);
        }
        return;
      } catch (err) {
        console.error('Firebase testimonials save failed, using fallback', err);
      }
    }
    const allTestimonials = getLocalData('vcard_testimonials', MOCK_TESTIMONIALS).filter(t => t.businessId !== businessId);
    allTestimonials.push(...testimonials);
    setLocalData('vcard_testimonials', allTestimonials);
  },

  // LEADS
  async getLeads(businessId?: string): Promise<Lead[]> {
    if (isFirebaseConfigured && db) {
      try {
        const leadsRef = collection(db, 'leads');
        const q = businessId 
          ? query(leadsRef, where('businessId', '==', businessId))
          : query(leadsRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lead));
        if (businessId) {
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return results;
      } catch (err) {
        console.error('Firebase leads read failed, using fallback', err);
      }
    }
    const leads = getLocalData('vcard_leads', MOCK_LEADS);
    const sortedLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (businessId) {
      return sortedLeads.filter(l => l.businessId === businessId);
    }
    return sortedLeads;
  },

  async saveLead(lead: Lead): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'leads', lead.id);
        await setDoc(docRef, lead);
        return;
      } catch (err) {
        console.error('Firebase lead save failed, using fallback', err);
      }
    }
    const leads = getLocalData('vcard_leads', MOCK_LEADS);
    leads.push(lead);
    setLocalData('vcard_leads', leads);
  },

  async deleteLead(id: string): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'leads', id));
        return;
      } catch (err) {
        console.error('Firebase lead delete failed, using fallback', err);
      }
    }
    const leads = getLocalData('vcard_leads', MOCK_LEADS).filter(l => l.id !== id);
    setLocalData('vcard_leads', leads);
  },

  // ANALYTICS
  async getAnalytics(businessId?: string): Promise<AnalyticsEntry[]> {
    if (isFirebaseConfigured && db) {
      try {
        const aRef = collection(db, 'analytics');
        const q = businessId
          ? query(aRef, where('businessId', '==', businessId))
          : query(aRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const results = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AnalyticsEntry));
        if (businessId) {
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        return results;
      } catch (err) {
        console.error('Firebase analytics read failed, using fallback', err);
      }
    }
    const analytics = getLocalData('vcard_analytics', MOCK_ANALYTICS);
    const sortedAnalytics = [...analytics].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (businessId) {
      return sortedAnalytics.filter(a => a.businessId === businessId);
    }
    return sortedAnalytics;
  },

  async saveAnalytics(entry: AnalyticsEntry): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'analytics', entry.id);
        await setDoc(docRef, entry);
        return;
      } catch (err) {
        console.error('Firebase analytics save failed, using fallback', err);
      }
    }
    const analytics = getLocalData('vcard_analytics', MOCK_ANALYTICS);
    analytics.push(entry);
    setLocalData('vcard_analytics', analytics);
  }
};
