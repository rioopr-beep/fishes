'use client';

import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';

export function useAbyssalInput({ isMobile = false, xRange = 10, yRange = 6 } = {}) {
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  const mapToWorld = useCallback(
    (clientX, clientY) => {
      const nx = clientX / window.innerWidth;
      const ny = clientY / window.innerHeight;
      targetRef.current.set((nx - 0.5) * xRange, -(ny - 0.5) * yRange, 0);
    },
    [xRange, yRange]
  );

  const onMouse = useCallback((e) => mapToWorld(e.clientX, e.clientY), [mapToWorld]);
  const onTouch = useCallback((e) => {
    const t = e.touches?.[0];
    if (t) mapToWorld(t.clientX, t.clientY);
  }, [mapToWorld]);

  useEffect(() => {
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [onMouse, onTouch]);

  return { targetRef };
}
