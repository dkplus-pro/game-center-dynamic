import type { ComponentSchema } from '../types';

export const GameListSchema: ComponentSchema = {
  type: 'GameList',
  label: '游戏列表',
  icon: '📜',
  defaultProps: {
    title: '全部游戏',
    showLoadMore: true,
    pageSize: 10,
    dataSource: { type: 'filter', filters: { tags: [], sortBy: 'popular', limit: 50 } },
  },
  propsMeta: {
    title: { type: 'text', label: '标题', required: true, maxLength: 20 },
    showLoadMore: { type: 'boolean', label: '加载更多', required: false },
    pageSize: { type: 'number', label: '每页数量', required: false, min: 5, max: 30, step: 5 },
    dataSource: { type: 'game-data-source', label: '游戏数据源', required: true },
  },
};