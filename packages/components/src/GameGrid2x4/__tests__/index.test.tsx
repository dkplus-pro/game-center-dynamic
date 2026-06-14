import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameGrid2x4 } from '../index';
import type { GameInfo } from '../../types';

describe('GameGrid2x4', () => {
  const mockGames: GameInfo[] = Array.from({ length: 8 }, (_, i) => ({
    id: `${i + 1}`,
    name: `游戏 ${i + 1}`,
    icon: `/icon-${i + 1}.png`,
    description: `游戏 ${i + 1} 的描述`,
    tags: ['动作'],
    rating: 4,
    category: 'action',
  }));

  it('renders title', () => {
    render(<GameGrid2x4 title="热门推荐" data={mockGames} />);
    expect(screen.getByText('热门推荐')).toBeDefined();
  });

  it('renders correct number of GameCards (limited to columns * 2)', () => {
    render(<GameGrid2x4 title="热门推荐" data={mockGames} columns={3} />);
    // 3 columns * 2 rows = 6 cards
    const cards = screen.getAllByRole('button');
    expect(cards.length).toBe(6);
  });

  it('shows empty state when data is empty array', () => {
    render(<GameGrid2x4 title="热门推荐" data={[]} />);
    expect(screen.getByText('暂无游戏')).toBeDefined();
  });

  it('shows skeleton loading when data is undefined', () => {
    // @ts-expect-error - testing undefined data scenario
    render(<GameGrid2x4 title="热门推荐" data={undefined} />);
    // Should render skeleton placeholders
    const heading = screen.getByText('热门推荐');
    expect(heading).toBeDefined();
  });

  it('renders rank badges when showRank is true', () => {
    render(<GameGrid2x4 title="热门推荐" data={mockGames.slice(0, 4)} showRank columns={2} />);
    // Rank 1 should be visible
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });
});