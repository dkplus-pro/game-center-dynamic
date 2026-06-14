import { useNavigate, useLocation } from '@modern-js/runtime/router';

/**
 * Left sidebar navigation for the admin panel.
 * Fixed width 200px, shows menu items with active state highlighting.
 */
export function Sidebar(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className="w-[200px] shrink-0 bg-gray-900 text-white flex flex-col h-full">
      {/* Logo / brand */}
      <div className="h-14 flex items-center px-4 border-b border-gray-700">
        <span className="text-lg font-bold tracking-wide">Game Center</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          <li>
            <button
              onClick={() => navigate('/')}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                isActive('/') && !isActive('/editor')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              📄 页面列表
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        <p>Admin v0.0.1</p>
      </div>
    </aside>
  );
}