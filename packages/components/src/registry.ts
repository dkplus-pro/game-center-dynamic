import { lazy } from 'react';
import type { ComponentSchema } from './types';

/**
 * A single entry in the component registry.
 * Links a component's render function, its schema, and its lazy-loaded PropsEditor.
 *
 * The component type uses `any` to accommodate components with varying required props.
 * At runtime, props are merged from the page-level data resolver.
 */
export interface ComponentRegistryEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  schema: ComponentSchema;
  PropsEditor: React.LazyExoticComponent<
    React.ComponentType<{ values: Record<string, unknown>; onChange: (v: Record<string, unknown>) => void }>
  >;
}

import { Banner } from './Banner';
import { BannerSchema } from './Banner/schema';
import { GameGrid2x4 } from './GameGrid2x4';
import { GameGrid2x4Schema } from './GameGrid2x4/schema';
import { GameCardSwiper } from './GameCardSwiper';
import { GameCardSwiperSchema } from './GameCardSwiper/schema';
import { GameGrid4x1 } from './GameGrid4x1';
import { GameGrid4x1Schema } from './GameGrid4x1/schema';
import { GameList } from './GameList';
import { GameListSchema } from './GameList/schema';

/**
 * Component registry mapping component type strings to their implementations.
 *
 * Each entry contains:
 * - component:    the render function (React component)
 * - schema:       metadata including defaultProps and propsMeta for the editor
 * - PropsEditor:  a lazy-loaded admin form component
 */
export const componentRegistry: Record<string, ComponentRegistryEntry> = {
  Banner: {
    component: Banner,
    schema: BannerSchema,
    PropsEditor: lazy(() =>
      import('./Banner/PropsEditor').then((m) => ({ default: m.BannerPropsEditor })),
    ),
  },
  GameGrid2x4: {
    component: GameGrid2x4,
    schema: GameGrid2x4Schema,
    PropsEditor: lazy(() =>
      import('./GameGrid2x4/PropsEditor').then((m) => ({ default: m.GameGrid2x4PropsEditor })),
    ),
  },
  GameCardSwiper: {
    component: GameCardSwiper,
    schema: GameCardSwiperSchema,
    PropsEditor: lazy(() =>
      import('./GameCardSwiper/PropsEditor').then((m) => ({
        default: m.GameCardSwiperPropsEditor,
      })),
    ),
  },
  GameGrid4x1: {
    component: GameGrid4x1,
    schema: GameGrid4x1Schema,
    PropsEditor: lazy(() =>
      import('./GameGrid4x1/PropsEditor').then((m) => ({
        default: m.GameGrid4x1PropsEditor,
      })),
    ),
  },
  GameList: {
    component: GameList,
    schema: GameListSchema,
    PropsEditor: lazy(() =>
      import('./GameList/PropsEditor').then((m) => ({ default: m.GameListPropsEditor })),
    ),
  },
};

/**
 * Flat list of component types with label and icon for UI pickers.
 */
export const componentList = Object.entries(componentRegistry).map(([type, entry]) => ({
  type,
  label: entry.schema.label,
  icon: entry.schema.icon,
}));