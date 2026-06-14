/**
 * Game information as returned by backend / data resolver.
 */
export interface GameInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  tags: string[];
  rating: number;
  category: string;
}

/**
 * Data source configuration used by the admin panel.
 * Components receive resolved `data` (GameInfo[]) at runtime, NOT DataSource.
 */
export interface DataSource {
  type: 'filter' | 'manual';
  filters?: {
    tags?: string[];
    category?: string;
    sortBy?: 'rating' | 'newest' | 'popular';
    limit?: number;
  };
  gameIds?: string[];
}

/**
 * Component schema used by the registry and PropsEditorFactory.
 */
export interface ComponentSchema {
  type: string;
  label: string;
  icon: string;
  defaultProps: Record<string, unknown>;
  propsMeta: Record<string, PropMeta>;
}

/**
 * Discriminated union of all supported property metadata types.
 */
export type PropMeta =
  | { type: 'text'; label: string; required?: boolean; maxLength?: number }
  | { type: 'boolean'; label: string; required?: boolean }
  | { type: 'select'; label: string; required?: boolean; options: { label: string; value: string }[] }
  | { type: 'color'; label: string; required?: boolean }
  | { type: 'image-list'; label: string; required?: boolean; maxCount?: number }
  | { type: 'game-data-source'; label: string; required?: boolean }
  | { type: 'number'; label: string; required?: boolean; min?: number; max?: number; step?: number };