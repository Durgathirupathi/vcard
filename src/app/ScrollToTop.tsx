'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Reset standard browser window scroll position instantly
    window.scrollTo({ top: 0, behavior: 'instant' });

    // 2. Reset all internal layout scrollable viewports (e.g. admin layout overflow-y-auto elements)
    const scrollContainers = document.querySelectorAll('.overflow-y-auto, main, [style*="overflow-y: auto"], [style*="overflow: auto"]');
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}
