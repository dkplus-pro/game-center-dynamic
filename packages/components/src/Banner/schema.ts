import type { ComponentSchema } from '../types';

export const BannerSchema: ComponentSchema = {
  type: 'Banner',
  label: '横幅轮播',
  icon: '🖼️',
  defaultProps: {
    images: [],
    autoplay: true,
    interval: 3000,
    height: 200,
  },
  propsMeta: {
    images: { type: 'image-list', label: '图片列表', required: true, maxCount: 5 },
    autoplay: { type: 'boolean', label: '自动播放', required: false },
    interval: { type: 'number', label: '间隔(ms)', required: false, min: 1000, max: 10000, step: 500 },
    height: { type: 'number', label: '高度(px)', required: false, min: 100, max: 500, step: 10 },
  },
};