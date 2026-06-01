# VCard Studio 🚀
### Premium Multi-Tenant Digital Business Card Platform

VCard Studio is a production-ready, beautiful, and secure multi-tenant digital business card builder and analytics portal. Built using **Next.js 15**, **React 19**, and **Firebase (Firestore & Auth)**, it features 5 premium responsive layouts tailored for different business categories, detailed lead capture pipelines, and centralized metrics.

---

## 🛡️ Senior Developer Security Architecture

This project is built from the ground up with defensive security best practices to enforce data integrity, tenant isolation, and client-side protection:

### 1. Cryptographic Server-Side Authentication & Session Checks
- **API Protection**: The `/api/upload` endpoint is secured by verifying the client's cryptographically signed Firebase Auth ID Token.
- **REST Token Resolver**: Without relying on heavy server-side Firebase SDK dependencies, the API endpoint utilizes the Google Identity Toolkit REST API to securely resolve and verify active JSON Web Tokens (JWT) in real-time.
- **Dev Bypass Mode**: A secure local developer mode is available that falls back to verifying local storage session headers, keeping the sandbox environment frictionless during development.

### 2. Multi-Tenant Firestore Security Rules (`firestore.rules`)
- **Row-Level Access Control**: Declared state-of-the-art Firestore security rules that mathematically guarantee a logged-in `business_owner` can **only** read and write to documents under their designated tenant scope.
- **Hierarchical Validation**: Testimonials, services, gallery images, videos, and leads check parental ownership `businesses/{businessId}.data.ownerUid == request.auth.uid` before authorizing database writes.
- **Public vs. Protected**: Public guests can read active profiles, write leads (submitting inquiries), and log analytics events, while blocking editing or deletion capabilities entirely.

### 3. Defensive Data-Access Tenant Isolation (`_authorizeTenant`)
- **Double-Layer Boundary Checks**: Integrated a centralized `_authorizeTenant` filter directly inside the core `dbService` layer (`src/lib/firestore.ts`).
- **Client Integrity**: Even if client-side state is altered or standard route middleware is bypassed, the database adapter intercepts all write queries (saves/deletes) and throws hard security violations if a tenant tries to modify resources belonging to another business.

### 4. Stored XSS Mitigation & Input Sanitization
- **URL Link Sanitizer**: All links rendered across the 5 templates are dynamically processed through a strict URL sanitizer (`src/lib/security.ts`). Protocols like `javascript:`, `data:`, or `vbscript:` are immediately intercepted and neutralized to prevent XSS script executions.
- **Text Entity Escaper**: Sanitizes user-submitted form inputs to encode standard HTML characters, completely blocking scripting or HTML injection attempts in the administration dashboard and public templates.

---

## 🎨 Premium Features

- **5 Harmonious Custom Layouts**: Sleek dark modes, gold-accented luxury interfaces, clean portfolio designs, store layouts, and glassmorphic micro-animations.
- **Image Compression**: Pre-compresses image files on the client side using HTML5 Canvas WebP conversion to save bandwidth and storage before uploading.
- **CSV Leads Exporter**: Enables tenant business owners to export their collected inquiries and customer messages as formatted spreadsheets.
- **Automatic vCard Generation**: Real-time generation of downloadable contacts (`.vcf` files) fully compliant with international specifications.

---

## ⚙️ Deployment Configurations

To deploy this platform securely to production:

### Firebase Rules Deployment
Ensure the newly generated `firestore.rules` and `storage.rules` are deployed:
```bash
# Deploys security boundaries securely to the active project
firebase deploy --only firestore:rules,storage
```

---

*Handcrafted with absolute care and focus on data security & clean software engineering.*
