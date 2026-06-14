import React from 'react';
import { useParams } from '@modern-js/runtime/router';
import { usePageData } from '../../hooks/usePageData';
import { SchemaRenderer } from '../../renderer/SchemaRenderer';
import { PageLoading, PageError } from '../../renderer/LoadingStates';

/**
 * H5Page — Published H5 page for end users.
 *
 * Uses a dynamic route `/:slug` to fetch the page schema from
 * `GET /api/pages/:slug?resolve=true` and renders it via the
 * SchemaRenderer engine.
 *
 * Three-layer fallback strategy:
 * - Layer 3 (page): PageLoading / PageError — fetch failure
 * - Layer 2 (data):  DataProvider  — component handles empty data
 * - Layer 1 (component): ErrorBoundary — render error per component
 */
export default function H5Page(): React.JSX.Element {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? '';

  if (!slug) {
    return <PageError error="缺少页面标识" />;
  }

  const { page, loading, error } = usePageData(slug);

  // Layer 3 fallback: page fetch failure
  if (loading) {
    return <PageLoading />;
  }

  if (error || !page) {
    return <PageError error={error} />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white">
      {/* Sticky page title header */}
      <div className="sticky top-0 z-10 border-b bg-white/90 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold">{page.name}</h1>
      </div>

      {/* Render schema components */}
      <SchemaRenderer components={page.components} />
    </div>
  );
}