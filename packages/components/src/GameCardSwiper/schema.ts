import type { ComponentSchema } from '../types';

export const GameCardSwiperSchema: ComponentSchema = {
  type: 'GameCardSwiper',
  label: '卡片轮播',
  icon: '🎠',
  defaultProps: {
    title: '为你推荐',
    cardCount: 3,
    dataSource: { type: 'filter', filters: { tags: [], sortBy: 'newest', limit: 10 } },
  },
  propsMeta: {
    title: { type: 'text', label: '标题', required: true, maxLength: 20 },
    cardCount: { type: 'number', label: '可见卡片数', required: false, min: 1, max: 5, step: 1 },
    dataSource: { type: 'game-data-source', label: '游戏数据源', required: true },
  },
};