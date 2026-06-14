import React, { useRef, useState, useCallback } from 'react';
import type { GameInfo } from '../types';
import { GameCard } from '../GameCard';

export interface GameCardSwiperProps {
  /** Section title displayed above the swiper. */
  title: string;
  /** Resolved game data array. */
  data: GameInfo[];
  /** Number of cards partially visible. Default: 3 */
  cardCount?: number;
}

/**
 * GameCardSwiper — A horizontal card carousel with snap scrolling.
 *
 * Features:
 * - Horizontal scroll with CSS scroll-snap
 * - 1.5 card peek effect (each card ~80% width of 1/N)
 * - Left/right navigation arrow buttons
 * - Arrows hidden when at scroll boundaries
 * - Empty state placeholder
 */
export function GameCardSwiper({
  title,
  data,
  cardCount = 3,
}: GameCardSwiperProps): React.JSX.Element {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex items-center justify-center rounded-lg bg-gray-50 py-12">
          <span className="text-sm text-gray-400">暂无推荐</span>
        </div>
      </div>
    );
  }

  /**
   * Scroll the container left by one card-width.
   */
  const scrollLeft = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.scrollWidth / data.length;
    container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  }, [data.length]);

  /**
   * Scroll the container right by one card-width.
   */
  const scrollRight = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.scrollWidth / data.length;
    container.scrollBy({ left: cardWidth, behavior: 'smooth' });
  }, [data.length]);

  /**
   * Update scroll boundary state based on current scroll position.
   */
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft: sl, scrollWidth, clientWidth } = container;
    setCanScrollLeft(sl > 1);
    setCanScrollRight(sl < scrollWidth - clientWidth - 1);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>

        {/* Navigation arrows */}
        <div className="flex gap-1">
          {canScrollLeft && (
            <button
              type="button"
              onClick={scrollLeft}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="向左滚动"
            >
              ‹
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={scrollRight}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="向右滚动"
            >
              ›
            </button>
          )}
        </div>
      </div>

      {/* Scrollable card row */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {data.map((game, index) => (
          <div
            key={game.id}
            className="shrink-0"
            style={{
              width: `calc((100% - ${(cardCount - 1) * 12}px) / ${cardCount})`,
              scrollSnapAlign: 'start',
            }}
          >
            <GameCard game={game} showRank rank={index + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}