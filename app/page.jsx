'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import PageTransition from '@/components/PageTransition';
import BackgroundInterpolator from '@/components/BackgroundInterpolator';

// Dynamic import: WebGL can't SSR
const AbyssalScene = dynamic(
  () => import('@/components/AbyssalScene'),
  { ssr: false }
);

// SSR-safe mobile detection
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function AbyssalDescentPage() {
  const isMobile = useIsMobile();
  // Shared ref: fish world position → drives contact reveal
  const fishWorldPos = useRef({ x: 0, y: 0, z: 0 });

  return (
    <PageTransition>
      <BackgroundInterpolator />

      {/*
        AbyssalScene owns the Canvas (position: fixed, z-index: 0).
        Its children prop is rendered inside <Scroll html> — DOM nodes
        that scroll in sync with the R3F ScrollControls viewport.
      */}
      <AbyssalScene isMobile={isMobile} fishWorldPos={fishWorldPos}>
        {/*
          These components render as normal DOM inside drei's <Scroll html>.
          Total height = 4 × 100vh (matching ScrollControls pages={4}).
        */}
        <div style={{ width: '100%' }}>
          {/* Page 0: Hero */}
          <HeroSection />

          {/* Pages 1–2: Projects (2 × ~100vh) */}
          <ProjectsSection />

          {/* Page 3: Contact + Footer */}
          <ContactSection fishWorldPos={fishWorldPos} />
        </div>
      </AbyssalScene>
    </PageTransition>
  );
}
