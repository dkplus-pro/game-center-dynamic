import React from 'react';
import { Outlet } from '@modern-js/runtime/router';

/**
 * Layout — Minimal full-screen shell for the H5 app.
 *
 * No header, no footer — just render the child route content
 * against a gray background. The page itself handles the white
 * card container and any sticky header.
 *
 * Using `min-h-screen` and `bg-gray-50` ensures the background
 * fills the viewport even on short pages.
 */
export default function Layout(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}