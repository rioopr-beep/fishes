'use client';

import { useEffect, useRef } from 'react';

/**
 * BackgroundInterpolator
 *
 * Listens to the drei ScrollControls scroll element and interpolates
 * the document background color:
 *   0% scroll → #0a0a0a (surface)
 *   100% scroll → #030303 (noir abyss)
 *
 * We target the canvas wrapper's background-color via a CSS variable
 * so it doesn't cause a React re-render on every scroll tick.
 */
export default function BackgroundInterpolator() {
  const rafRef = useRef(null);

  useEffect(() => {
    // drei's ScrollControls creates a scroll container div
    // Fallback: listen to the wrapper's scroll event
    const scrollEl =
      document.querySelector('[data-scroll]') ||
      document.querySelector('.r3f-scroll-container') ||
      window;

    const lerp = (a, b, t) => a + (b - a) * t;

    const update = () => {
      let progress = 0;

      if (scrollEl === window) {
        const max = document.body.scrollHeight - window.innerHeight;
        progress = max > 0 ? window.scrollY / max : 0;
      } else {
        progress =
          scrollEl.scrollTop / (scrollEl.scrollHeight - scrollEl.clientHeight) || 0;
      }

      progress = Math.min(Math.max(progress, 0), 1);

      // Interpolate: #0a0a0a → #030303
      const r = Math.round(lerp(10, 3, progress));
      const color = `rgb(${r},${r},${r})`;
      document.documentElement.style.setProperty('--abyss-bg', color);
      document.body.style.background = color;

      rafRef.current = requestAnimationFrame(update);
    };

    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return null; // purely side-effect
}
