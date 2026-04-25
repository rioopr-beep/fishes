'use client';

import { useRef, useState, useCallback } from 'react';

/**
 * useAdaptiveQuality
 *
 * Listens to R3F PerformanceMonitor events.
 * When FPS drops below ~40 (onDecline), disables Fresnel shader.
 * When performance recovers (onIncline), re-enables it.
 *
 * Returns:
 *   fresnelEnabled — boolean passed to Lionfish shader
 *   onDecline      — passed to <PerformanceMonitor onDecline={} />
 *   onIncline      — passed to <PerformanceMonitor onIncline={} />
 */
export function useAdaptiveQuality() {
  const [fresnelEnabled, setFresnelEnabled] = useState(true);
  const dipCount = useRef(0);

  const onDecline = useCallback(() => {
    dipCount.current += 1;
    if (dipCount.current >= 2) {
      // Two consecutive dips → kill Fresnel
      setFresnelEnabled(false);
      console.info('[AbyssalQuality] Fresnel disabled — low FPS');
    }
  }, []);

  const onIncline = useCallback(() => {
    if (dipCount.current > 0) dipCount.current -= 1;
    // Only re-enable after sustained good perf
    if (dipCount.current === 0) {
      setFresnelEnabled(true);
    }
  }, []);

  return { fresnelEnabled, onDecline, onIncline };
}
