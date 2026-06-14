import React from 'react';

/**
 * PageLoading — Skeleton loading state for the H5 page.
 *
 * Displays pulsing placeholders while the page schema is being
 * fetched from the backend. Mimics the rough layout of a typical
 * game-center page (header + content blocks).
 */
function PageLoading(): React.JSX.Element {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-white p-4">
      <div className="animate-pulse space-y-4">
        {/* Header skeleton */}
        <div className="h-6 w-1/3 rounded bg-gray-200" />
        {/* Banner-like skeleton */}
        <div className="h-40 rounded bg-gray-200" />
        {/* Grid-like skeleton */}
        <div className="h-60 rounded bg-gray-200" />
        {/* List-like skeleton */}
        <div className="space-y-3">
          <div className="h-16 rounded bg-gray-200" />
          <div className="h-16 rounded bg-gray-200" />
          <div className="h-16 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * PageError — Friendly error display with retry button.
 *
 * Shown when the page schema fetch fails. Provides a human-readable
 * message and a retry button that reloads the page.
 *
 * @param error - Error message to display, or null for a generic message.
 */
function PageError({ error }: { error: string | null }): React.JSX.Element {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-white p-8 text-center">
      <div className="mb-4 text-4xl">😞</div>
      <h2 className="mb-2 text-lg font-bold">页面加载失败</h2>
      <p className="mb-4 text-gray-500">
        {error || '请稍后再试'}
      </p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="rounded-full bg-blue-500 px-6 py-2 text-white"
      >
        重试
      </button>
    </div>
  );
}

export { PageLoading, PageError };