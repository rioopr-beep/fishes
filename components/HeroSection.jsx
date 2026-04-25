'use client';

// Hero Section — 100vh, z-index above canvas, pointer-events:none for mouse passthrough
export default function HeroSection() {
  return (
    <section
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 8vw',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontFamily: '"Courier New", monospace',
          fontSize: 'clamp(9px, 1.2vw, 12px)',
          letterSpacing: '0.5em',
          color: 'rgba(60,130,255,0.55)',
          margin: '0 0 16px',
          textTransform: 'uppercase',
        }}
      >
        Portfolio — Design & Development
      </p>

      {/* Name: bold serif, wide tracking */}
      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: 700,
          fontSize: 'clamp(56px, 9vw, 130px)',
          letterSpacing: '0.12em',
          lineHeight: 0.9,
          color: '#f0f0f0',
          margin: 0,
          textTransform: 'uppercase',
        }}
      >
        rprtx
      </h1>

      {/* Subtitle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginTop: 28,
        }}
      >
        <div
          style={{
            width: 48,
            height: 1,
            background: 'rgba(60,130,255,0.4)',
          }}
        />
        <p
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 'clamp(11px, 1.4vw, 14px)',
            letterSpacing: '0.3em',
            color: 'rgba(180,200,230,0.55)',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Into the Abyss
        </p>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '8vh',
          left: '8vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        <p
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 10,
            letterSpacing: '0.35em',
            color: 'rgba(60,120,200,0.4)',
            margin: 0,
            textTransform: 'uppercase',
          }}
        >
          Scroll to descend
        </p>
        {/* Animated line */}
        <div
          style={{
            width: 1,
            height: 48,
            background:
              'linear-gradient(to bottom, rgba(60,120,200,0.4), transparent)',
            animation: 'pulseDown 2s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes pulseDown {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.7; transform: scaleY(1.1); }
        }
      `}</style>
    </section>
  );
}
