import { BusinessCard } from '../types';

export const generateVCardText = (card: BusinessCard): string => {
  const parts = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN;CHARSET=UTF-8:${card.ownerName}`,
    `ORG;CHARSET=UTF-8:${card.businessName}`,
    `TITLE;CHARSET=UTF-8:${card.designation}`,
    `TEL;TYPE=CELL,VOICE,PREF:${card.mobile}`,
    `TEL;TYPE=WORK,VOICE:${card.whatsapp}`
  ];

  if (card.alternateMobile) {
    parts.push(`TEL;TYPE=HOME,VOICE:${card.alternateMobile}`);
  }

  parts.push(`EMAIL;TYPE=PREF,INTERNET:${card.email}`);

  if (card.website) {
    parts.push(`URL:${card.website}`);
  }

  if (card.address) {
    // Escape semi-colons and newlines in addresses according to vcard specs
    const escapedAddress = card.address.replace(/;/g, '\\;').replace(/\n/g, ', ');
    parts.push(`ADR;TYPE=WORK,POSTAL,PARCEL;CHARSET=UTF-8:;;${escapedAddress};;;;`);
  }

  parts.push(`REV:${new Date().toISOString()}`);
  parts.push('END:VCARD');

  return parts.join('\n');
};

export const downloadVCard = (card: BusinessCard): void => {
  if (typeof window === 'undefined') return;

  const vcardText = generateVCardText(card);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  
  // Format slug for safe file naming
  const safeFileName = `${card.slug || 'contact'}.vcf`;
  link.setAttribute('download', safeFileName);
  
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
