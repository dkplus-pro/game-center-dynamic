import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameCardSwiper } from '../index';
import type { GameInfo } from '../../types';

describe('GameCardSwiper', () => {
  const mockGames: GameInfo[] = Array.from({ length: 10 }, (_, i) => ({
    id: `${i + 1}`,
    name: `游戏 ${i + 1}`,
    icon: `/icon-${i + 1}.png`,
    description: `游戏 ${i + 1} 的描述`,
    tags: ['动作'],
    rating: 4,
    category: 'action',
  }));

  it('renders title', () => {
    render(<GameCardSwiper title="为你推荐" data={mockGames} />);
    expect(screen.getByText('为你推荐')).toBeDefined();
  });

  it('renders all game cards', () => {
    render(<GameCardSwiper title="为你推荐" data={mockGames} />);
    // Each game name should be visible
    expect(screen.getByText('游戏 1')).toBeDefined();
    expect(screen.getByText('游戏 10')).toBeDefined();
  });

  it('shows empty state when data is empty', () => {
    render(<GameCardSwiper title="为你推荐" data={[]} />);
    expect(screen.getByText('暂无推荐')).toBeDefined();
  });

  it('shows empty state when data is undefined', () => {
    // @ts-expect-error - testing undefined data scenario
    render(<GameCardSwiper title="为你推荐" data={undefined} />);
    expect(screen.getByText('暂无推荐')).toBeDefined();
  });

  it('renders rank badges on cards', () => {
    render(<GameCardSwiper title="为你推荐" data={mockGames.slice(0, 2)} cardCount={2} />);
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });
});