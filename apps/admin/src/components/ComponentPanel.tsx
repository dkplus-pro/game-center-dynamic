import { useDraggable } from '@dnd-kit/core';
import { componentList } from '@game-center/components';

/**
 * Left panel displaying the list of available components.
 * Each component is wrapped in a dnd-kit `useDraggable` hook
 * so it can be dragged into the preview canvas.
 */
export function ComponentPanel(): React.JSX.Element {
  return (
    <aside className="w-[240px] shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="h-12 flex items-center px-4 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-gray-700">组件面板</h2>
      </div>

      {/* Component list */}
      <div className="flex-1 p-3 space-y-2">
        {componentList.map((item: { type: string; label: string; icon: string }) => (
          <DraggableComponentItem key={item.type} type={item.type} label={item.label} icon={item.icon} />
        ))}
      </div>
    </aside>
  );
}

/** Props for a single draggable component item. */
interface DraggableComponentItemProps {
  type: string;
  label: string;
  icon: string;
}

/**
 * A single draggable component card in the component panel.
 * Uses @dnd-kit/core useDraggable to enable drag-and-drop.
 */
function DraggableComponentItem({ type, label, icon }: DraggableComponentItemProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `panel-${type}`,
    data: { type, source: 'panel' },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}