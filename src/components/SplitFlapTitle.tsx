'use client';

import { useState, useEffect, useRef } from 'react';
import { SplitFlap, Presets } from 'react-split-flap';

// Default titles - can be overridden via localStorage from dad portal
const DEFAULT_TITLES = [
  'Product Engineer',
  'Full Stack Creator',
  'Zero-to-One Builder',
  'Software Futurist',
  'Pizza Chef',
  'Dad',
  'Software Seuss',
];

const STORAGE_KEY = 'scottd3v-titles';

// Helper to load titles from localStorage (aliased for dad portal compatibility)
export function getTitles(): string[] {
  if (typeof window === 'undefined') return DEFAULT_TITLES;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Invalid JSON, use defaults
    }
  }
  return DEFAULT_TITLES;
}

// Alias for dad portal
export const getStoredTitles = getTitles;

// Helper to get default titles
export function getDefaultTitles(): string[] {
  return [...DEFAULT_TITLES];
}

// Helper to save titles to localStorage
export function saveTitles(titles: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(titles));
}

// Helper to reset to defaults
export function resetTitles(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export { DEFAULT_TITLES };

export default function SplitFlapTitle() {
  const [titles, setTitles] = useState<string[]>(DEFAULT_TITLES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const loadedTitles = getTitles();
    setTitles(loadedTitles);
    // Start with a random title
    setCurrentIndex(Math.floor(Math.random() * loadedTitles.length));
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % titles.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [mounted, titles.length]);

  const currentTitle = titles[currentIndex]?.toUpperCase() || '';
  const displayLength = currentTitle.length;

  // Calculate font size based on container width and character count
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const calculateFontSize = () => {
      const container = containerRef.current;
      if (!container) return;

      // Available width minus padding (20px each side)
      const availableWidth = container.offsetWidth - 40;
      // Each character is roughly 1.3ch wide (1.1ch + gap)
      const charWidth = 1.3;
      // Calculate font size to fill width
      const calculatedSize = availableWidth / (displayLength * charWidth);
      // Clamp between 16px and 40px
      const clampedSize = Math.max(16, Math.min(40, calculatedSize));
      setFontSize(clampedSize);
    };

    calculateFontSize();
    window.addEventListener('resize', calculateFontSize);
    return () => window.removeEventListener('resize', calculateFontSize);
  }, [mounted, displayLength]);

  if (!mounted) {
    // SSR placeholder
    return (
      <div className="h-10 flex items-center justify-center">
        <span className="text-zinc-500 text-lg tracking-wider uppercase">
          {DEFAULT_TITLES[0]}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="split-flap-wrapper flex justify-center items-center min-h-[56px] w-full"
    >
      <div
        className="split-flap-inner"
        style={{ '--flap-font-size': `${fontSize}px` } as React.CSSProperties}
      >
        <SplitFlap
          value={currentTitle}
          chars={Presets.ALPHANUM}
          length={displayLength}
          timing={30}
          hinge
          theme="dark"
          size="medium"
          background="#2a2a2a"
          fontColor="#e8e4de"
        />
      </div>
      <style jsx global>{`
        .split-flap-wrapper {
          perspective: 1000px;
          max-width: 100%;
        }

        .split-flap-inner {
          display: flex;
          justify-content: center;
          padding: 10px 16px;
          background: linear-gradient(180deg, #1f1f1f 0%, #181818 100%);
          border-radius: 12px;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* Use CSS variable for dynamic font size */
        .split-flap-inner .split-flap-display {
          font-size: var(--flap-font-size, 24px) !important;
          gap: 2px !important;
        }

        .split-flap-inner .split-flap-digit {
          background: #2a2a2a !important;
          color: #e8e4de !important;
          border-radius: 4px !important;
        }

        .split-flap-inner .split-flap-part {
          background: linear-gradient(180deg, #2d2d2d 0%, #2d2d2d 49.5%, #252525 50.5%, #252525 100%) !important;
          border-color: #333 !important;
        }

        /* Desktop: allow larger max size */
        @media (min-width: 640px) {
          .split-flap-inner {
            padding: 14px 24px;
            border-radius: 14px;
          }

          .split-flap-inner .split-flap-display {
            gap: 3px !important;
          }
        }
      `}</style>
    </div>
  );
}
