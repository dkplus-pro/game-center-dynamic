import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface BannerProps {
  /** Array of image URLs to display in the carousel. */
  images: string[];
  /** Whether the carousel automatically advances. Default: true */
  autoplay: boolean;
  /** Time between auto-advances in milliseconds. Default: 3000 */
  interval: number;
  /** Height of the banner in pixels. Default: 200 */
  height?: number;
}

/**
 * Banner — An auto-playing image carousel component.
 *
 * Features:
 * - Auto-advance with configurable interval
 * - Manual previous/next navigation buttons
 * - Indicator dots at the bottom showing current position
 * - CSS transition for smooth sliding
 * - Empty state placeholder when no images provided
 */
export function Banner({
  images,
  autoplay,
  interval,
  height = 200,
}: BannerProps): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /** Total number of images (0 if empty array). */
  const total = images.length;

  /**
   * Advance to the next image (wraps around to start).
   */
  const goToNext = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  /**
   * Go back to the previous image (wraps around to end).
   */
  const goToPrev = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  /**
   * Jump directly to a specific image index.
   * @param index - The target image index.
   */
  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Set up auto-play timer
  useEffect(() => {
    if (!autoplay || total <= 1) return;

    timerRef.current = setInterval(goToNext, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoplay, interval, goToNext, total]);

  // Empty state: no images
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-gray-100"
        style={{ height }}
      >
        <span className="text-sm text-gray-400">暂无图片</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg" style={{ height }}>
      {/* Image track with CSS transition */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={index} className="h-full w-full shrink-0">
            <img
              src={src}
              alt={`轮播图 ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Previous button */}
      {total > 1 && (
        <button
          type="button"
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="上一张"
        >
          ‹
        </button>
      )}

      {/* Next button */}
      {total > 1 && (
        <button
          type="button"
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
          aria-label="下一张"
        >
          ›
        </button>
      )}

      {/* Indicator dots */}
      {total > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToIndex(index)}
              aria-label={`切换到第 ${index + 1} 张`}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}