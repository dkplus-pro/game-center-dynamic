import { useState } from 'react';
import { useEditorStore } from '../stores/useEditorStore';

/**
 * Top bar for the admin panel.
 * Shows page title, save draft / publish buttons, and preview link.
 * In the page list view, the TopBar is simplified (no editor actions).
 *
 * Controlled by the `showEditorActions` prop — when true, displays
 * the full editor toolbar (save, publish, preview, dirty indicator).
 */
export function TopBar({ showEditorActions }: { showEditorActions?: boolean }): React.JSX.Element {
  const pageName = useEditorStore((s) => s.pageName);
  const slug = useEditorStore((s) => s.slug);
  const isDirty = useEditorStore((s) => s.isDirty);
  const saveDraft = useEditorStore((s) => s.saveDraft);
  const publish = useEditorStore((s) => s.publish);

  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Show a temporary toast message that auto-dismisses after 2 seconds.
   */
  function showToast(message: string): void {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }

  /**
   * Handle save draft with loading state and toast feedback.
   */
  async function handleSaveDraft(): Promise<void> {
    setLoading(true);
    try {
      await saveDraft();
      showToast('草稿已保存');
    } catch (err: unknown) {
      showToast(`保存失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Handle publish with loading state and toast feedback.
   */
  async function handlePublish(): Promise<void> {
    setLoading(true);
    try {
      await publish();
      showToast('发布成功');
    } catch (err: unknown) {
      showToast(`发布失败: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Open the H5 preview in a new tab with draft mode.
   */
  function handlePreview(): void {
    window.open(`/h5/preview?slug=${slug}&draft=true`, '_blank');
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 relative">
      {/* Left: page title */}
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-gray-800">
          {showEditorActions ? pageName || '未命名页面' : '页面管理'}
        </h1>
        {showEditorActions && isDirty && (
          <span className="w-2 h-2 rounded-full bg-orange-500" title="有未保存的修改" />
        )}
      </div>

      {/* Right: editor actions */}
      {showEditorActions && (
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            预览
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存草稿'}
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="px-3 py-1.5 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? '发布中...' : '发布'}
          </button>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg z-50 animate-pulse">
          {toast}
        </div>
      )}
    </header>
  );
}