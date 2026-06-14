import React from 'react';

/**
 * Root H5 landing page.
 *
 * Shows a simple welcome screen when no slug is provided.
 * Users navigate to published pages via /:slug URLs.
 */
export default function H5Root(): React.JSX.Element {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-white px-8 text-center">
      <span className="mb-4 text-6xl">🎮</span>
      <h1 className="mb-2 text-xl font-bold text-gray-800">Game Center</h1>
      <p className="text-sm text-gray-500">访问 /页面名称 浏览已发布的页面</p>
    </div>
  );
}