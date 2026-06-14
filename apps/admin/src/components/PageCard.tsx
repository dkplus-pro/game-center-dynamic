/**
 * Card component for displaying a page in the page list.
 * Shows name, slug, status badge, version, and action buttons.
 */
import type { PageListItem } from '../routes/page';

/** Props for the PageCard component. */
interface PageCardProps {
  page: PageListItem;
  onEdit: (slug: string) => void;
  onPreview: (slug: string) => void;
}

/**
 * Renders a single page card with metadata and action buttons.
 */
export function PageCard({ page, onEdit, onPreview }: PageCardProps): React.JSX.Element {
  const statusLabel = page.status === 'published' ? '已发布' : '草稿';
  const statusColor = page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600';

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3">
      {/* Header: name + status */}
      <div className="flex items-start justify-between">
        <h3 className="text-base font-semibold text-gray-800 truncate flex-1 mr-2">
          {page.name}
        </h3>
        <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
          {statusLabel}
        </span>
      </div>

      {/* Slug */}
      <p className="text-xs text-gray-400 truncate">
        /{page.slug}
      </p>

      {/* Meta: version */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <span>v{page.version}</span>
        {page.createdAt && (
          <span>{new Date(page.createdAt).toLocaleDateString('zh-CN')}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(page.slug)}
          className="flex-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
        >
          编辑
        </button>
        <button
          onClick={() => onPreview(page.slug)}
          className="flex-1 px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
        >
          预览
        </button>
      </div>
    </div>
  );
}

/**
 * Skeleton placeholder for loading state.
 */
export function PageCardSkeleton(): React.JSX.Element {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-5 bg-gray-200 rounded w-12" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-1/3" />
      <div className="flex items-center gap-4">
        <div className="h-3 bg-gray-100 rounded w-10" />
        <div className="h-3 bg-gray-100 rounded w-20" />
      </div>
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <div className="flex-1 h-8 bg-gray-100 rounded" />
        <div className="flex-1 h-8 bg-gray-100 rounded" />
      </div>
    </div>
  );
}