import { Outlet, useLocation } from '@modern-js/runtime/router';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import '../styles/global.css';

/**
 * Root layout for the admin panel.
 *
 * Structure:
 * ┌──────────────────────────────────┐
 * │  TopBar (56px)                   │
 * ├─────────┬────────────────────────┤
 * │ Sidebar │ Outlet (content)       │
 * │ 200px   │ flex-1                 │
 * └─────────┴────────────────────────┘
 */
export default function Layout(): React.JSX.Element {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <TopBar showEditorActions={isEditor} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}