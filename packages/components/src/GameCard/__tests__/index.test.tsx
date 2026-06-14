import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameCard } from '../index';
import type { GameInfo } from '../../types';

describe('GameCard', () => {
  const mockGame: GameInfo = {
    id: '1',
    name: '测试游戏',
    icon: '/test-icon.png',
    description: '这是一个测试游戏的描述',
    tags: ['动作', '冒险'],
    rating: 4,
    category: 'action',
  };

  it('renders game name and tags correctly', () => {
    render(<GameCard game={mockGame} />);

    expect(screen.getByText('测试游戏')).toBeDefined();
    expect(screen.getByText('动作')).toBeDefined();
    expect(screen.getByText('冒险')).toBeDefined();
  });

  it('shows rank badge when showRank and rank are provided', () => {
    render(<GameCard game={mockGame} showRank rank={3} />);

    expect(screen.getByText('3')).toBeDefined();
  });

  it('does not show rank badge when showRank is false', () => {
    render(<GameCard game={mockGame} showRank={false} rank={3} />);

    expect(screen.queryByText('3')).toBeNull();
  });

  it('shows description when showDescription is true', () => {
    render(<GameCard game={mockGame} showDescription />);

    expect(screen.getByText('这是一个测试游戏的描述')).toBeDefined();
  });

  it('shows placeholder when game icon is missing', () => {
    const gameNoIcon = { ...mockGame, icon: '' };
    render(<GameCard game={gameNoIcon} />);

    // With no icon, the component renders a gamepad emoji placeholder
    expect(screen.getByText('测试游戏')).toBeDefined();
  });

  it('handles click event', () => {
    const handleClick = vi.fn();
    render(<GameCard game={mockGame} onClick={handleClick} />);

    // Click the card (role="button") instead of img
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});