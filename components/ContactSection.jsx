'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';

// Contact items — revealed when Lionfish is near (torch effect)
const CONTACTS = [
  { label: 'Email', value: 'rprtx@abyss.dev', href: 'mailto:rprtx@abyss.dev' },
  { label: 'GitHub', value: 'github.com/rprtx', href: 'https://github.com' },
  { label: 'LinkedIn', value: 'linkedin.com/in/rprtx', href: 'https://linkedin.com' },
  { label: 'Dribbble', value: 'dribbble.com/rprtx', href: 'https://dribbble.com' },
];

// Single contact line — fades in when fish is near
function ContactLine({ label, value, href, fishWorldPos, baseDelay }) {
  const lineRef = useRef(null);
  const [opacity, setOpacity] = useState(0.2);
  const [glowing, setGlowing] = useState(false);
  const rafRef = useRef(null);

  // DOM element's approximate 3D world position
  // Contact section sits at scroll page ~3.5, Y ≈ -10 in world space
  // We track proximity on X only (horizontal), Y proximity is scroll-driven
  const checkProximity = useCallback(() => {
    if (!fishWorldPos?.current) return;

    const fish = fishWorldPos.current;
    // Contact section is roughly at world Y -10 to -12 (end of descent)
    // We use a simplified 2D distance on XZ plane since we know Y is handled by scroll
    const dx = fish.x;
    const dy = fish.y + 10; // offset: contact is at world Y ~ -10
    const dist = Math.sqrt(dx * dx + dy * dy);

    const revealDist = 3.5;
    const proximity = Math.max(0, 1 - dist / revealDist);
    const targetOpacity = 0.2 + proximity * 0.8;

    setOpacity(targetOpacity);
    setGlowing(proximity > 0.5);

    rafRef.current = requestAnimationFrame(checkProximity);
  }, [fishWorldPos]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(checkProximity);
    return () => cancelAnimationFrame(rafRef.current);
  }, [checkProximity]);

  return (
    <a
      ref={lineRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 16,
        opacity,
        transition: 'opacity 0.4s ease',
        textDecoration: 'none',
        pointerEvents: opacity > 0.5 ? 'all' : 'none',
        cursor: opacity > 0.5 ? 'pointer' : 'default',
        padding: '8px 0',
      }}
    >
      <span
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 10,
          letterSpacing: '0.35em',
          color: 'rgba(60,130,255,0.6)',
          textTransform: 'uppercase',
          width: 72,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(14px, 2vw, 18px)',
          color: glowing ? '#e8f0ff' : 'rgba(200,215,240,0.7)',
          letterSpacing: '0.04em',
          transition: 'color 0.3s ease, text-shadow 0.3s ease',
          textShadow: glowing
            ? '0 0 20px rgba(60,130,255,0.5)'
            : 'none',
        }}
      >
        {value}
      </span>
    </a>
  );
}

// Full contact + footer section
export default function ContactSection({ fishWorldPos }) {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 8vw 10vh',
      }}
    >
      {/* Divider */}
      <div
        style={{
          width: '100%',
          height: 1,
          background:
            'linear-gradient(to right, rgba(60,130,255,0.15), transparent)',
          marginBottom: 48,
          pointerEvents: 'none',
        }}
      />

      {/* Section label */}
      <p
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 10,
          letterSpacing: '0.5em',
          color: 'rgba(60,130,255,0.35)',
          textTransform: 'uppercase',
          margin: '0 0 40px',
          pointerEvents: 'none',
        }}
      >
        ── The Sea Bed — Navigate toward the light to reveal
      </p>

      {/* Contact lines */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {CONTACTS.map((c, i) => (
          <ContactLine
            key={c.label}
            {...c}
            fishWorldPos={fishWorldPos}
            baseDelay={i * 80}
          />
        ))}
      </div>

      {/* Footer line */}
      <div
        style={{
          marginTop: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 10,
            letterSpacing: '0.25em',
            color: 'rgba(120,140,180,0.25)',
            textTransform: 'uppercase',
          }}
        >
          rprtx — Abyssal Descent © 2024
        </span>
        <span
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 10,
            letterSpacing: '0.25em',
            color: 'rgba(120,140,180,0.25)',
            textTransform: 'uppercase',
          }}
        >
          6,000m below surface
        </span>
      </div>
    </section>
  );
}
