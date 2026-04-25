'use client';

import { useRef, useEffect, useState } from 'react';

const PROJECTS = [
  {
    id: 'fog-chess',
    title: 'Fog Chess',
    tag: 'Game Development',
    year: '2024',
    description:
      'A strategic chess variant where each piece casts vision like a torch — the board outside your light radius is hidden in noir fog. Built with Rust + WebAssembly.',
    stack: ['Rust', 'WASM', 'Three.js', 'WebRTC'],
    link: '#',
    align: 'left',
  },
  {
    id: 'stream-rp',
    title: 'StreamRP',
    tag: 'Interactive Platform',
    year: '2024',
    description:
      'Live collaborative roleplay platform for streamers. Audience members propose actions, the streamer narrates in real-time. Sub-200ms reaction loop.',
    stack: ['Next.js', 'WebSocket', 'Redis', 'Framer'],
    link: '#',
    align: 'right',
  },
];

// Individual glassmorphic card
function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const isLeft = project.align === 'left';

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        padding: '0 6vw',
        marginBottom: '4vh',
      }}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 'clamp(300px, 42vw, 520px)',
          padding: '36px 40px',
          pointerEvents: 'all',
          cursor: 'default',

          // Glassmorphism
          background: hovered
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',

          border: hovered
            ? '1px solid rgba(60,130,255,0.35)'
            : '1px solid rgba(255,255,255,0.08)',

          borderRadius: 2,

          // Glow on hover — simulates fish proximity light
          boxShadow: hovered
            ? '0 0 40px rgba(26,111,255,0.15), inset 0 1px 0 rgba(255,255,255,0.06)'
            : 'inset 0 1px 0 rgba(255,255,255,0.04)',

          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 10,
              letterSpacing: '0.35em',
              color: 'rgba(60,130,255,0.6)',
              textTransform: 'uppercase',
            }}
          >
            {project.tag}
          </span>
          <span
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: 'rgba(180,200,230,0.3)',
            }}
          >
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            fontSize: 'clamp(28px, 4vw, 40px)',
            letterSpacing: '0.08em',
            color: hovered ? '#f8f8f8' : '#d0d0d0',
            margin: '0 0 16px',
            textTransform: 'uppercase',
            transition: 'color 0.3s ease',
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 14,
            lineHeight: 1.85,
            color: 'rgba(180,200,220,0.65)',
            margin: '0 0 28px',
          }}
        >
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {project.stack.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: '"Courier New", monospace',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'rgba(60,130,255,0.7)',
                padding: '4px 10px',
                border: '1px solid rgba(60,130,255,0.2)',
                borderRadius: 1,
                textTransform: 'uppercase',
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            style={{
              width: 24,
              height: 1,
              background: 'rgba(60,130,255,0.6)',
            }}
          />
          <span
            style={{
              fontFamily: '"Courier New", monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(60,130,255,0.7)',
              textTransform: 'uppercase',
            }}
          >
            View Project
          </span>
        </div>
      </div>
    </div>
  );
}

// Projects section — 2×100vh = occupies pages 1.5–3
export default function ProjectsSection() {
  return (
    <section
      style={{
        paddingTop: '15vh',
        paddingBottom: '10vh',
      }}
    >
      {/* Section label */}
      <div
        style={{
          padding: '0 6vw',
          marginBottom: '8vh',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: '"Courier New", monospace',
            fontSize: 10,
            letterSpacing: '0.5em',
            color: 'rgba(60,130,255,0.4)',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          ── Selected Work
        </p>
      </div>

      {PROJECTS.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </section>
  );
}
