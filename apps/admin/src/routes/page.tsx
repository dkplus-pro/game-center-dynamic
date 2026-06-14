import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from '@modern-js/runtime/router';
import { PageCard, PageCardSkeleton } from '../components/PageCard';

/** Shape of a page item returned from GET /api/pages. */
export interface PageListItem {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published';
  version: number;
  createdAt: number;
  updatedAt: number;
}

/** API response wrapper for page list. */
interface PageListResponse {
  data: PageListItem[];
}

/** API response wrapper for page creation. */
interface CreatePageResponse {
  data: { id: string; slug: string };
}

/**
 * Page list route — the default/admin index page.
 *
 * Features:
 * - Fetches all pages from GET /api/pages on mount
 * - Displays as a card grid with loading skeletons
 * - "新建页面" button → POST /api/pages → navigate to editor
 * - Each card has "编辑" and "预览" action buttons
 */
export default function PageList(): React.JSX.Element {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all pages from the server.
   */
  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pages');
      if (!res.ok) throw new Error('Failed to fetch pages');
      const body = (await res.json()) as PageListResponse;
      setPages(body.data ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  /**
   * Create a new page and navigate to its editor.
   */
  async function handleCreatePage(): Promise<void> {
    const slug = `page-${Date.now()}`;
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '未命名页面', slug }),
      });
      if (!res.ok) throw new Error('Failed to create page');
      const body = (await res.json()) as CreatePageResponse;
      navigate(`/editor/${body.data.slug}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '创建失败');
    }
  }

  /**
   * Navigate to the editor for a page.
   */
  function handleEdit(slug: string): void {
    navigate(`/editor/${slug}`);
  }

  /**
   * Open the H5 preview in a new tab.
   */
  function handlePreview(slug: string): void {
    window.open(`/h5/preview?slug=${slug}`, '_blank');
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">页面列表</h1>
          <p className="text-sm text-gray-500 mt-1">管理所有动态页面</p>
        </div>
        <button
          onClick={handleCreatePage}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          + 新建页面
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
          <button onClick={fetchPages} className="ml-3 underline hover:no-underline">
            重试
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PageCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && pages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <span className="text-6xl mb-4">📄</span>
          <p className="text-lg mb-4">暂无页面，点击新建开始搭建</p>
          <button
            onClick={handleCreatePage}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 新建页面
          </button>
        </div>
      )}

      {/* Page card grid */}
      {!loading && pages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pages.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              onEdit={handleEdit}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}
    </div>
  );
}