'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const AbyssalScene = dynamic(
  () => import('@/components/AbyssalScene'),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        position: 'fixed', inset: 0, 
        background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <p style={{ color: 'rgba(60,130,255,0.5)', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.3em' }}>
          INITIALIZING...
        </p>
      </div>
    )
  }
);

// Lazy load semua komponen UI
const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false });
const ProjectsSection = dynamic(() => import('@/components/ProjectsSection'), { ssr: false });
const ContactSection = dynamic(() => import('@/components/ContactSection'), { ssr: false });
const PageTransition = dynamic(() => import('@/components/PageTransition'), { ssr: false });
const BackgroundInterpolator = dynamic(() => import('@/components/BackgroundInterpolator'), { ssr: false });

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
  const fishWorldPos = useRef({ x: 0, y: 0, z: 0 });
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div style={{ 
        position: 'fixed', inset: 0, background: '#0a0a0a',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16
      }}>
        <p style={{ color: '#ff4444', fontFamily: 'monospace', fontSize: 12 }}>
          ERROR: {error}
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary onError={setError}>
      <BackgroundInterpolator />
      <PageTransition>
        <AbyssalScene isMobile={isMobile} fishWorldPos={fishWorldPos}>
          <div style={{ width: '100%' }}>
            <HeroSection />
            <ProjectsSection />
            <ContactSection fishWorldPos={fishWorldPos} />
          </div>
        </AbyssalScene>
      </PageTransition>
    </ErrorBoundary>
  );
}

class ErrorBoundary extends Error {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error: error.message };
  }
  componentDidCatch(error) {
    this.props.onError?.(error.message);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
