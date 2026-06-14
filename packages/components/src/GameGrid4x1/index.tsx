import React from 'react';
import type { GameInfo } from '../types';
import { GameCard } from '../GameCard';

export interface GameGrid4x1Props {
  /** Resolved game data array. */
  data: GameInfo[];
  /** Whether to show the game description on each card. Default: true */
  showDescription?: boolean;
}

/**
 * GameGrid4x1 — A vertical list layout (4 rows × 1 column).
 *
 * Features:
 * - Each row is a full-width game card with icon left, info right
 * - Rows separated by subtle dividers
 * - Optional description text per card
 * - Loading skeleton state
 * - Empty state placeholder
 */
export function GameGrid4x1({
  data,
  showDescription = true,
}: GameGrid4x1Props): React.JSX.Element {
  // Loading skeleton state
  if (!data) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-gray-50 py-12">
        <span className="text-sm text-gray-400">暂无游戏</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {data.slice(0, 4).map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          showRank
          rank={index + 1}
          showDescription={showDescription}
        />
      ))}
    </div>
  );
}