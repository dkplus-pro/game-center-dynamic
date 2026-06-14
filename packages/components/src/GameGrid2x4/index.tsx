import React from 'react';
import type { GameInfo } from '../types';
import { GameCard } from '../GameCard';

export interface GameGrid2x4Props {
  /** Section title displayed above the grid. */
  title: string;
  /** Resolved game data array. */
  data: GameInfo[];
  /** Whether to show rank badges on cards. Default: true */
  showRank?: boolean;
  /** Number of columns in the grid. Default: 4 */
  columns?: number;
}

/**
 * GameGrid2x4 — A 2-row × N-column game card grid layout.
 *
 * Features:
 * - Section heading with customizable title
 * - CSS Grid layout with configurable column count
 * - Each cell renders a GameCard with optional rank badge
 * - Skeleton loading state when data is null/undefined
 * - Empty placeholder when data array is empty
 */
export function GameGrid2x4({
  title,
  data,
  showRank = true,
  columns = 4,
}: GameGrid2x4Props): React.JSX.Element {
  // Loading skeleton state
  if (!data) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns * 2 }, (_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex items-center justify-center rounded-lg bg-gray-50 py-12">
          <span className="text-sm text-gray-400">暂无游戏</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {data.slice(0, columns * 2).map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            showRank={showRank}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
}