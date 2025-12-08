'use client';

import { useState, useEffect, useRef } from 'react';
import { SplitFlap, Presets } from 'react-split-flap';

// Default titles as strings (stored format) - splits by space for display
const DEFAULT_TITLES: string[] = [
  'Product Engineer',
  'Full Stack Creator',
  '0-2-1 Builder',
  'Software Futurist',
  'Pizza Chef',
  'Dad',
  'Software Seuss',
];

const STORAGE_KEY = 'scottd3v-titles';

// Helper to split a title string into words for display
function splitTitle(title: string): string[] {
  return title.split(' ').filter(w => w.length > 0);
}

// Helper to load titles from localStorage
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

// Individual row component that sizes itself
function SplitFlapRow({ word, containerWidth }: { word: string; containerWidth: number }) {
  const upperWord = word.toUpperCase();
  const charCount = upperWord.length;

  // Calculate font size: available width / (chars * char width)
  // Padding is 32px total (16px each side)
  const availableWidth = containerWidth - 32;
  const charWidth = 1.35; // Each char is ~1.35ch with gaps
  const calculatedSize = availableWidth / (charCount * charWidth);
  // Clamp between 18px and 48px
  const fontSize = Math.max(18, Math.min(48, calculatedSize));

  return (
    <div
      className="split-flap-row"
      style={{ '--row-font-size': `${fontSize}px` } as React.CSSProperties}
    >
      <SplitFlap
        value={upperWord}
        chars={Presets.ALPHANUM}
        length={charCount}
        timing={30}
        hinge
        theme="dark"
        size="medium"
        background="#1a1a18"
        fontColor="#f5f3e7"
      />
    </div>
  );
}

export default function SplitFlapTitle() {
  const [titles, setTitles] = useState<string[]>(DEFAULT_TITLES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [containerWidth, setContainerWidth] = useState(320);
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

  // Measure container width
  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [mounted]);

  // Split current title string into words for multi-row display
  const currentTitleWords = splitTitle(titles[currentIndex] || '');

  if (!mounted) {
    // SSR placeholder
    return (
      <div className="min-h-[60px] flex flex-col items-center justify-center gap-1">
        {splitTitle(DEFAULT_TITLES[0]).map((word, i) => (
          <span key={i} className="text-zinc-500 text-lg tracking-wider uppercase">
            {word}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="split-flap-wrapper flex justify-center items-center w-full"
    >
      <div className="split-flap-inner">
        <div className="split-flap-stack">
          {currentTitleWords.map((word, index) => (
            <SplitFlapRow
              key={`${currentIndex}-${index}`}
              word={word}
              containerWidth={containerWidth}
            />
          ))}
        </div>
      </div>
      <style jsx global>{`
        .split-flap-wrapper {
          perspective: 1000px;
          max-width: 100%;
        }

        .split-flap-inner {
          display: flex;
          justify-content: center;
          padding: 12px 16px;
          background: linear-gradient(180deg, #1a1a18 0%, #151513 100%);
          border-radius: 12px;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .split-flap-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .split-flap-row {
          display: flex;
          justify-content: center;
        }

        /* Use CSS variable for dynamic font size per row */
        .split-flap-row .split-flap-display {
          font-size: var(--row-font-size, 24px) !important;
          gap: 2px !important;
        }

        .split-flap-inner .split-flap-digit {
          background: #1a1a18 !important;
          color: #f5f3e7 !important;
          border-radius: 4px !important;
        }

        .split-flap-inner .split-flap-part {
          background: linear-gradient(180deg, #1e1e1c 0%, #1e1e1c 49.5%, #181816 50.5%, #181816 100%) !important;
          border-color: #2a2a28 !important;
        }

        /* Desktop */
        @media (min-width: 640px) {
          .split-flap-inner {
            padding: 16px 24px;
            border-radius: 14px;
          }

          .split-flap-stack {
            gap: 6px;
          }

          .split-flap-row .split-flap-display {
            gap: 3px !important;
          }
        }
      `}</style>
    </div>
  );
}
