import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameGrid4x1 } from '../index';
import type { GameInfo } from '../../types';

describe('GameGrid4x1', () => {
  const mockGames: GameInfo[] = Array.from({ length: 4 }, (_, i) => ({
    id: `${i + 1}`,
    name: `游戏 ${i + 1}`,
    icon: `/icon-${i + 1}.png`,
    description: `游戏 ${i + 1} 的描述信息`,
    tags: ['动作'],
    rating: 4,
    category: 'action',
  }));

  it('renders items in vertical list', () => {
    render(<GameGrid4x1 data={mockGames} />);
    expect(screen.getByText('游戏 1')).toBeDefined();
    expect(screen.getByText('游戏 4')).toBeDefined();
  });

  it('shows description when showDescription is true', () => {
    render(<GameGrid4x1 data={mockGames} showDescription />);
    expect(screen.getByText('游戏 1 的描述信息')).toBeDefined();
  });

  it('does not show description when showDescription is false', () => {
    render(<GameGrid4x1 data={mockGames} showDescription={false} />);
    expect(screen.queryByText('游戏 1 的描述信息')).toBeNull();
  });

  it('shows empty state when data is empty array', () => {
    render(<GameGrid4x1 data={[]} />);
    expect(screen.getByText('暂无游戏')).toBeDefined();
  });

  it('renders rank badges', () => {
    render(<GameGrid4x1 data={mockGames.slice(0, 2)} />);
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
  });

  it('shows skeleton loading when data is undefined', () => {
    // @ts-expect-error - testing undefined data scenario
    render(<GameGrid4x1 data={undefined} />);
    // Skeleton placeholders should exist
    // The component renders 4 skeleton divs with animate-pulse class
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(12);
  });
});