'use client';

import { motion, AnimatePresence } from 'framer-motion';

/**
 * PageTransition
 *
 * Wraps the entire page in a Framer Motion fade-in on mount.
 * On route changes (Next.js), the exit animation plays before unmount.
 *
 * Fish and camera always start at their origin (0,0,0 / 0,0,8) because
 * the refs are initialized fresh on mount — the fade-in masks any
 * first-frame position flash.
 */
export default function PageTransition({ children }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="abyssal-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Initial vignette that fades out after canvas load */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: '#000000',
            pointerEvents: 'none',
          }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
