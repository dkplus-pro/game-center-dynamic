import React from 'react';
import type { GameInfo } from '../types';

export interface GameCardProps {
  game: GameInfo;
  /** Whether to show rank badge. Default: false */
  showRank?: boolean;
  /** Rank number displayed as a badge (e.g. 1, 2, 3). Only visible when showRank=true. */
  rank?: number;
  /** Whether to show the game description. Default: false */
  showDescription?: boolean;
  /** Click handler for the entire card. */
  onClick?: () => void;
}

/**
 * Render star icons based on a numeric rating (1-5).
 * @param rating - Rating value between 0 and 5.
 * @returns Array of star span elements.
 */
function renderStars(rating: number): React.JSX.Element[] {
  const fullStars = Math.round(rating);
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < fullStars ? 'text-yellow-400' : 'text-gray-300'}>
      ★
    </span>
  ));
}

/**
 * GameCard — A reusable card component for displaying game information.
 *
 * Features:
 * - Icon image (48×48) with fallback placeholder
 * - Game name and optional rank badge
 * - Tags as small colored badges
 * - Star rating display
 * - Optional description text
 * - Click handler support
 */
export function GameCard({
  game,
  showRank = false,
  rank,
  showDescription = false,
  onClick,
}: GameCardProps): React.JSX.Element {
  if (!game) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-400">加载中...</div>
      </div>
    );
  }

  const { name, icon, description, tags, rating } = game;

  return (
    <div
      className="flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' && onClick) onClick(); }}
    >
      {/* Top row: icon, name, rank */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {icon ? (
            <img src={icon} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400 text-lg">🎮</div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-gray-900">{name}</span>
            {showRank && rank !== undefined && (
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                {rank}
              </span>
            )}
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-0.5 mt-0.5">{renderStars(rating)}</div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {showDescription && description && (
        <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
      )}
    </div>
  );
}