import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameList } from '../index';
import type { GameInfo } from '../../types';

describe('GameList', () => {
  const mockGames: GameInfo[] = Array.from({ length: 15 }, (_, i) => ({
    id: `${i + 1}`,
    name: `游戏 ${i + 1}`,
    icon: `/icon-${i + 1}.png`,
    description: `游戏 ${i + 1} 的描述`,
    tags: ['动作'],
    rating: 4,
    category: 'action',
  }));

  it('renders title', () => {
    render(<GameList title="全部游戏" data={mockGames} />);
    expect(screen.getByText('全部游戏')).toBeDefined();
  });

  it('shows "加载更多" button when showLoadMore is true and more items available', () => {
    render(<GameList title="全部游戏" data={mockGames} showLoadMore pageSize={5} />);
    expect(screen.getByText('加载更多')).toBeDefined();
  });

  it('paginates correctly when "加载更多" is clicked', () => {
    render(<GameList title="全部游戏" data={mockGames} showLoadMore pageSize={5} />);

    // Initially shows 5 items
    expect(screen.getByText('游戏 5')).toBeDefined();
    expect(screen.queryByText('游戏 6')).toBeNull();

    // Click "加载更多"
    fireEvent.click(screen.getByText('加载更多'));

    // Now shows 10 items
    expect(screen.getByText('游戏 6')).toBeDefined();
    expect(screen.queryByText('游戏 11')).toBeNull();
  });

  it('shows empty state when data is empty', () => {
    render(<GameList title="全部游戏" data={[]} />);
    expect(screen.getByText('暂无更多游戏')).toBeDefined();
  });

  it('shows empty state when data is undefined', () => {
    // @ts-expect-error - testing undefined data scenario
    render(<GameList title="全部游戏" data={undefined} />);
    expect(screen.getByText('暂无更多游戏')).toBeDefined();
  });

  it('hides "加载更多" when all items are visible', () => {
    render(<GameList title="全部游戏" data={mockGames.slice(0, 3)} showLoadMore pageSize={10} />);
    expect(screen.queryByText('加载更多')).toBeNull();
  });
});