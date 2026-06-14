import React, { useState, useMemo } from 'react';
import type { GameInfo } from '../types';
import { GameCard } from '../GameCard';

export interface GameListProps {
  /** Section title displayed above the list. */
  title: string;
  /** Resolved game data array. */
  data: GameInfo[];
  /** Whether to show the "加载更多" button. Default: true */
  showLoadMore?: boolean;
  /** Number of items per page. Default: 10 */
  pageSize?: number;
}

/**
 * GameList — A vertical game list with pagination support.
 *
 * Features:
 * - Vertical list of GameCard items
 * - Internal pagination: shows pageSize items initially
 * - "加载更多" button to load next page
 * - Button hidden when all items are shown
 * - Empty state placeholder
 */
export function GameList({
  title,
  data,
  showLoadMore = true,
  pageSize = 10,
}: GameListProps): React.JSX.Element {
  /**
   * Tracks how many items are currently visible.
   * Incremented by pageSize each time "加载更多" is clicked.
   */
  const [visibleCount, setVisibleCount] = useState(pageSize);

  /** Guard against undefined data — hooks must be called unconditionally. */
  const safeData = data ?? [];

  /** Items currently displayed. */
  const visibleItems = useMemo(() => safeData.slice(0, visibleCount), [safeData, visibleCount]);

  /** Whether more items remain to be loaded. */
  const hasMore = visibleCount < safeData.length;

  /**
   * Load the next page of items by increasing visibleCount.
   */
  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + pageSize, safeData.length));
  };

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="flex items-center justify-center rounded-lg bg-gray-50 py-12">
          <span className="text-sm text-gray-400">暂无更多游戏</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      <div className="flex flex-col gap-2">
        {visibleItems.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            showRank
            rank={index + 1}
            showDescription
          />
        ))}
      </div>

      {/* Load more button */}
      {showLoadMore && hasMore && (
        <button
          type="button"
          onClick={loadMore}
          className="w-full rounded-lg bg-blue-50 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition-colors"
        >
          加载更多
        </button>
      )}
    </div>
  );
}