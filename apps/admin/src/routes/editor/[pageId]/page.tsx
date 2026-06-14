import { useEffect, useState } from 'react';
import { useParams } from '@modern-js/runtime/router';
import { useEditorStore } from '../../../stores/useEditorStore';
import { ComponentPanel } from '../../../components/ComponentPanel';
import { PreviewCanvas } from '../../../components/PreviewCanvas';
import { PropsPanel } from '../../../components/PropsPanel';

/**
 * Editor page route — the three-panel drag-and-drop page builder.
 *
 * Layout:
 * ┌──────────────┬────────────────────┬──────────────┐
 * │ ComponentPanel│ PreviewCanvas      │ PropsPanel   │
 * │ (240px)      │ (flex-1)           │ (280px)      │
 * └──────────────┴────────────────────┴──────────────┘
 *
 * On mount:
 * - Loads the page by slug from GET /api/pages/:slug?resolve=true
 * - Populates the zustand editor store
 */
export default function EditorPage(): React.JSX.Element {
  const { pageId } = useParams<{ pageId: string }>();
  const loadPage = useEditorStore((s) => s.loadPage);
  const setPageMeta = useEditorStore((s) => s.setPageMeta);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pageId) return;

    async function init(): Promise<void> {
      setLoading(true);
      setError(null);

      // Handle "new" page — just set a blank state
      if (pageId === 'new') {
        setPageMeta({
          pageId: 'new',
          pageName: '未命名页面',
          slug: `page-${Date.now()}`,
          status: 'draft',
        });
        setLoading(false);
        return;
      }

      // Load existing page
      try {
        await loadPage(pageId!);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : '加载页面失败');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [pageId, loadPage, setPageMeta]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">加载页面...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4 text-red-500">
          <span className="text-4xl">⚠️</span>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Three-panel editor layout
  return (
    <div className="flex h-full overflow-hidden">
      <ComponentPanel />
      <PreviewCanvas />
      <PropsPanel />
    </div>
  );
}