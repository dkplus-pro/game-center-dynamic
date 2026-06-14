import { useState, useEffect, useCallback } from 'react';
import type { PageSchema } from '@game-center/types';

/**
 * Result type for the usePageData hook.
 */
interface UsePageDataResult {
  /** The resolved page schema, or null if not yet loaded / on error. */
  page: PageSchema | null;
  /** Whether the initial fetch is in progress. */
  loading: boolean;
  /** Human-readable error message, or null. */
  error: string | null;
}

const API_BASE = '/api';

/**
 * Fetches a page schema from the backend.
 *
 * Constructs `GET /api/pages/${slug}?resolve=true` to receive
 * the page schema with pre-resolved game data embedded in each
 * component's `resolvedData` field.
 *
 * When `isDraft` is true, also appends `&draft=true` so the
 * backend returns the latest unpublished version.
 *
 * @param slug   - The page slug to look up.
 * @param isDraft - Whether to fetch the draft (preview) version.
 * @returns Page data, loading flag, and error message.
 */
export function usePageData(slug: string, isDraft?: boolean): UsePageDataResult {
  const [page, setPage] = useState<PageSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Build the query string based on draft flag.
   */
  const buildUrl = useCallback(() => {
    const params = new URLSearchParams({ resolve: 'true' });
    if (isDraft) {
      params.set('draft', 'true');
    }
    return `${API_BASE}/pages/${slug}?${params.toString()}`;
  }, [slug, isDraft]);

  useEffect(() => {
    let cancelled = false;

    /**
     * Fetch page data from the API and update state.
     */
    const fetchPage = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = buildUrl();
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('页面不存在');
          }
          throw new Error(`请求失败 (${response.status})`);
        }

        const data: PageSchema = await response.json();

        if (!cancelled) {
          setPage(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : '未知错误，请稍后再试';
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPage();

    return () => {
      cancelled = true;
    };
  }, [buildUrl]);

  return { page, loading, error };
}