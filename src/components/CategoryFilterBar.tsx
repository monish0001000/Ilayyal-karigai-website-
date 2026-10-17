import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useLocale } from '../context/LocaleContext';

export interface CategoryFilterItem {
  key: string;
  english: string;
  tamil: string;
  count?: number;
}

interface CategoryFilterBarProps {
  categories: CategoryFilterItem[];
  activeCategory: string;
  onSelectCategory: (key: string) => void;
  className?: string;
  ariaLabel?: string;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  className = '',
  ariaLabel = 'Filter collections by category',
}) => {
  const { locale } = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 6);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  // Scroll active item into view smoothly on mobile/narrow viewports
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      const container = scrollRef.current;
      const scrollPos =
        activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <nav
      className={`glass-filter-wrapper ${className}`}
      aria-label={ariaLabel}
    >
      {/* Edge gradient masks for mobile scroll indication */}
      <div
        className={`filter-fade-mask mask-left ${canScrollLeft ? 'is-visible' : ''}`}
        aria-hidden="true"
      />
      <div
        className={`filter-fade-mask mask-right ${canScrollRight ? 'is-visible' : ''}`}
        aria-hidden="true"
      />

      {/* Horizontal Scroll Track */}
      <div
        className="glass-filter-scroll-track"
        ref={scrollRef}
        onScroll={checkScroll}
      >
        <div className="glass-filter-pills-row" role="tablist">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            // Strict Language Separation: single localized label without dual English/Tamil clutter
            const localizedLabel = locale === 'ta' ? (cat.tamil || cat.english) : cat.english;

            return (
              <motion.button
                key={cat.key}
                role="tab"
                aria-selected={isActive}
                data-active={isActive}
                onClick={() => onSelectCategory(cat.key)}
                className={`glass-category-pill ${isActive ? 'is-active' : ''}`}
                whileHover={{
                  y: -2,
                  scale: 1.03,
                  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Background Shimmer Layer */}
                <span className="pill-shimmer-sweep" aria-hidden="true" />

                {/* Animated active background pill using layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPillBg"
                    className="pill-active-bg-fill"
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}

                {/* Single Locale Clean Label Stack */}
                <div className="pill-content-stack">
                  <div className="pill-title-row">
                    <span className="pill-clean-label">{localizedLabel}</span>
                    {cat.count !== undefined && (
                      <span className="pill-badge-count">{cat.count}</span>
                    )}
                  </div>
                </div>

                {/* Floating Glow Indicator Dot / Underline using layoutId */}
                {isActive && (
                  <motion.span
                    layoutId="activeCategoryGlowDot"
                    className="pill-active-glow-dot"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 38,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
