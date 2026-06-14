import type { ComponentSchema } from '../types';

export const GameGrid4x1Schema: ComponentSchema = {
  type: 'GameGrid4x1',
  label: '游戏列表(4×1)',
  icon: '📋',
  defaultProps: {
    showDescription: true,
    dataSource: { type: 'filter', filters: { tags: [], sortBy: 'rating', limit: 4 } },
  },
  propsMeta: {
    showDescription: { type: 'boolean', label: '显示描述', required: false },
    dataSource: { type: 'game-data-source', label: '游戏数据源', required: true },
  },
};