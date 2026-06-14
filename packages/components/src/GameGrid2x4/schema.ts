import type { ComponentSchema } from '../types';

export const GameGrid2x4Schema: ComponentSchema = {
  type: 'GameGrid2x4',
  label: '游戏网格(2×4)',
  icon: '🎮',
  defaultProps: {
    title: '热门推荐',
    showRank: true,
    columns: 4,
    dataSource: { type: 'filter', filters: { tags: [], sortBy: 'rating', limit: 8 } },
  },
  propsMeta: {
    title: { type: 'text', label: '标题', required: true, maxLength: 20 },
    showRank: { type: 'boolean', label: '显示排名', required: false },
    columns: {
      type: 'select',
      label: '列数',
      required: false,
      options: [
        { label: '2列', value: '2' },
        { label: '3列', value: '3' },
        { label: '4列', value: '4' },
      ],
    },
    dataSource: { type: 'game-data-source', label: '游戏数据源', required: true },
  },
};