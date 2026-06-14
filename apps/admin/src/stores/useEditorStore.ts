import { create } from 'zustand';
import { componentRegistry } from '@game-center/components';

/** A single component instance on the canvas. */
export interface ComponentInstance {
  id: string;
  type: string;
  order: number;
  props: Record<string, unknown>;
}

/** Page metadata returned by the server. */
export interface PageMeta {
  pageId: string;
  pageName: string;
  slug: string;
  status: 'draft' | 'published';
}

/** Maximum number of undo history entries. */
const MAX_HISTORY = 50;

/** API base URL — proxied through Modern.js dev server. */
const API_BASE = '/api';

/** Editor state managed by zustand. */
export interface EditorState {
  pageId: string;
  pageName: string;
  slug: string;
  status: 'draft' | 'published';

  components: ComponentInstance[];
  selectedId: string | null;

  isDirty: boolean;
  lastSavedSnapshot: string;

  history: ComponentInstance[][];
  historyIndex: number;

  setPageMeta: (meta: Partial<PageMeta>) => void;
  addComponent: (type: string, index?: number) => void;
  removeComponent: (id: string) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  updateComponentProps: (id: string, props: Record<string, unknown>) => void;
  selectComponent: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  saveDraft: () => Promise<void>;
  publish: () => Promise<void>;
  loadPage: (slug: string) => Promise<void>;
}

/**
 * Generate a simple UUID v4 for component ids.
 */
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Serialize components array for dirty-tracking comparison.
 */
function serializeComponents(components: ComponentInstance[]): string {
  return JSON.stringify(components);
}

/** Debounce timer ID for updateComponentProps. */
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
/** Pending prop updates to merge before snapshot push. */
let pendingProps: Record<string, Record<string, unknown>> = {};

/**
 * Push a snapshot of the current components onto the history stack.
 * Truncates any future history (redo stack) and enforces MAX_HISTORY limit.
 */
function pushSnapshot(
  components: ComponentInstance[],
  set: (partial: Partial<EditorState>) => void,
  get: () => EditorState,
): void {
  const state = get();
  // Truncate future history
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(components.map((c) => ({ ...c, props: { ...c.props } })));

  // Enforce limit
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }

  const snapshot = serializeComponents(components);
  set({
    components,
    history: newHistory,
    historyIndex: newHistory.length - 1,
    isDirty: snapshot !== state.lastSavedSnapshot,
  });
}

/**
 * Reorder the `order` field of all components so they match their
 * array index (0-based, ascending).
 */
function reorderComponents(components: ComponentInstance[]): ComponentInstance[] {
  return components.map((c, i) => ({ ...c, order: i }));
}

/**
 * Zustand editor store for the admin page editor.
 *
 * Features:
 * - Component CRUD (add, remove, move, update props)
 * - Undo / redo with 50-entry history limit
 * - Dirty tracking via lastSavedSnapshot
 * - Save draft (PUT) and publish (POST) workflows
 * - Debounced prop updates to avoid excessive history entries
 */
export const useEditorStore = create<EditorState>()((set, get) => ({
  pageId: '',
  pageName: '',
  slug: '',
  status: 'draft',

  components: [],
  selectedId: null,

  isDirty: false,
  lastSavedSnapshot: '[]',

  history: [[]],
  historyIndex: 0,

  /**
   * Update page metadata fields.
   */
  setPageMeta: (meta) => set(meta),

  /**
   * Add a new component to the canvas at the specified index.
   * Reads defaultProps from the component registry.
   */
  addComponent: (type, index) => {
    const state = get();
    const entry = componentRegistry[type];
    const defaultProps = entry ? { ...entry.schema.defaultProps } : {};

    const newComp: ComponentInstance = {
      id: generateId(),
      type,
      order: 0,
      props: defaultProps,
    };

    const targetIndex = index ?? state.components.length;
    const newComponents = [...state.components];
    newComponents.splice(targetIndex, 0, newComp);
    const reordered = reorderComponents(newComponents);

    pushSnapshot(reordered, set, get);
    set({ selectedId: newComp.id });
  },

  /**
   * Remove a component from the canvas by id.
   */
  removeComponent: (id) => {
    const state = get();
    const filtered = state.components.filter((c) => c.id !== id);
    const reordered = reorderComponents(filtered);
    pushSnapshot(reordered, set, get);

    if (state.selectedId === id) {
      set({ selectedId: null });
    }
  },

  /**
   * Move a component from one index to another (drag reorder).
   */
  moveComponent: (fromIndex, toIndex) => {
    const state = get();
    const newComponents = [...state.components];
    const [moved] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, moved);
    const reordered = reorderComponents(newComponents);
    pushSnapshot(reordered, set, get);
  },

  /**
   * Update the props of a component.
   * Debounced by 300ms — multiple consecutive calls are merged
   * and a single history snapshot is pushed after the debounce.
   */
  updateComponentProps: (id, props) => {
    const state = get();

    // Merge into pending buffer
    pendingProps[id] = { ...(pendingProps[id] ?? {}), ...props };

    // Apply optimistically to the live components array
    const updated = state.components.map((c) =>
      c.id === id ? { ...c, props: { ...c.props, ...pendingProps[id] } } : c,
    );
    set({ components: updated, isDirty: true });

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      // After debounce, push the final merged state to history
      const finalState = get();
      const finalComponents = finalState.components.map((c) =>
        c.id === id && pendingProps[id]
          ? { ...c, props: { ...c.props } }
          : c,
      );
      pendingProps = {};
      pushSnapshot(finalComponents, set, get);
    }, 300);
  },

  /**
   * Select a component by id (or deselect if null).
   */
  selectComponent: (id) => set({ selectedId: id }),

  /**
   * Undo the last change. Restores the previous history snapshot.
   */
  undo: () => {
    const state = get();
    if (state.historyIndex <= 0) return;

    const newIndex = state.historyIndex - 1;
    const restored = state.history[newIndex].map((c) => ({
      ...c,
      props: { ...c.props },
    }));
    const snapshot = serializeComponents(restored);

    set({
      components: restored,
      historyIndex: newIndex,
      isDirty: snapshot !== state.lastSavedSnapshot,
    });
  },

  /**
   * Redo a previously undone change. Restores the next history snapshot.
   */
  redo: () => {
    const state = get();
    if (state.historyIndex >= state.history.length - 1) return;

    const newIndex = state.historyIndex + 1;
    const restored = state.history[newIndex].map((c) => ({
      ...c,
      props: { ...c.props },
    }));
    const snapshot = serializeComponents(restored);

    set({
      components: restored,
      historyIndex: newIndex,
      isDirty: snapshot !== state.lastSavedSnapshot,
    });
  },

  /**
   * Save the current page as a draft.
   * PUT /api/pages/:pageId with name, slug, and components.
   */
  saveDraft: async () => {
    const state = get();
    const body = {
      name: state.pageName,
      slug: state.slug,
      components: state.components,
    };

    const res = await fetch(`${API_BASE}/pages/${state.pageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error((err as { error: string }).error || 'Save failed');
    }

    const snapshot = serializeComponents(state.components);
    set({
      isDirty: false,
      lastSavedSnapshot: snapshot,
    });
  },

  /**
   * Publish the current page.
   * POST /api/pages/:pageId/publish
   */
  publish: async () => {
    const state = get();

    const res = await fetch(`${API_BASE}/pages/${state.pageId}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error((err as { error: string }).error || 'Publish failed');
    }

    set({ status: 'published' });
  },

  /**
   * Load a page from the server by slug.
   * GET /api/pages/:slug?resolve=true
   */
  loadPage: async (slug) => {
    const res = await fetch(`${API_BASE}/pages/${slug}?resolve=true`);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error((err as { error: string }).error || 'Load failed');
    }

    const body = await res.json();
    const page = body.data as {
      id: string;
      name: string;
      slug: string;
      status: 'draft' | 'published';
      version: number;
      components: ComponentInstance[];
    };

    const loadedComponents = (page.components ?? []).map((c: ComponentInstance, i: number) => ({
      ...c,
      order: c.order ?? i,
      props: { ...c.props },
    }));

    const snapshot = serializeComponents(loadedComponents);

    set({
      pageId: page.id,
      pageName: page.name,
      slug: page.slug,
      status: page.status,
      components: loadedComponents,
      selectedId: null,
      isDirty: false,
      lastSavedSnapshot: snapshot,
      history: [loadedComponents.map((c: ComponentInstance) => ({ ...c, props: { ...c.props } }))],
      historyIndex: 0,
    });
  },
}));