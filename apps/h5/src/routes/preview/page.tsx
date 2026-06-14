import React from 'react';
import { useSearchParams } from '@modern-js/runtime/router';
import { usePageData } from '../../hooks/usePageData';
import { SchemaRenderer } from '../../renderer/SchemaRenderer';
import { PageLoading, PageError } from '../../renderer/LoadingStates';

/**
 * PreviewPage — Admin preview route for unpublished / draft pages.
 *
 * Accessible at `/h5/preview?pageId=xxx&draft=true`.
 * Passes `isDraft=true` to `usePageData` so the backend returns
 * the latest draft version instead of the published one.
 *
 * Displays a yellow "预览模式" banner at the top to distinguish
 * from the published end-user experience.
 */
export default function PreviewPage(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('pageId') || '';
  const isDraft = searchParams.get('draft') === 'true';

  const { page, loading, error } = usePageData(pageId, isDraft);

  if (loading) {
    return <PageLoading />;
  }

  if (error || !page) {
    return <PageError error={error} />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white">
      {/* Preview mode banner */}
      <div className="sticky top-0 z-20 border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-center text-sm font-medium text-yellow-700">
        🔍 预览模式
      </div>

      {/* Page title header */}
      <div className="sticky top-9 z-10 border-b bg-white/90 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold">{page.name}</h1>
      </div>

      {/* Render schema components */}
      <SchemaRenderer components={page.components} />
    </div>
  );
}