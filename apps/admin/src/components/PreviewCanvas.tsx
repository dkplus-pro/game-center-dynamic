import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { componentRegistry, componentList } from '@game-center/components';
import { useEditorStore, type ComponentInstance } from '../stores/useEditorStore';
import { SimulatedDevice } from './SimulatedDevice';

/**
 * Center preview canvas with drag-and-drop support.
 *
 * Uses @dnd-kit DndContext to handle:
 * - Dragging from ComponentPanel → canvas (adds new component)
 * - Reordering components within the canvas (sortable)
 * - Click to select a component
 */
export function PreviewCanvas(): React.JSX.Element {
  const components = useEditorStore((s) => s.components);
  const selectedId = useEditorStore((s) => s.selectedId);
  const addComponent = useEditorStore((s) => s.addComponent);
  const moveComponent = useEditorStore((s) => s.moveComponent);
  const selectComponent = useEditorStore((s) => s.selectComponent);

  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  /**
   * Handle drag start — track the active drag item for the overlay.
   */
  function handleDragStart(event: DragStartEvent): void {
    const { active } = event;
    setActiveId(active.id as string);

    if (active.data.current?.source === 'panel') {
      setActiveType(active.data.current.type as string);
    }
  }

  /**
   * Handle drag end — either add a new component from the panel
   * or reorder existing components within the canvas.
   */
  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;

    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    // Case 1: Dragged from component panel → add to canvas
    if (active.data.current?.source === 'panel') {
      const type = active.data.current.type as string;
      const overIndex = components.findIndex((c) => c.id === over.id);
      addComponent(type, overIndex >= 0 ? overIndex : undefined);
      return;
    }

    // Case 2: Reordering within canvas
    if (active.id !== over.id) {
      const oldIndex = components.findIndex((c) => c.id === active.id);
      const newIndex = components.findIndex((c) => c.id === over.id);
      if (oldIndex >= 0 && newIndex >= 0) {
        moveComponent(oldIndex, newIndex);
      }
    }
  }

  /**
   * Handle click on canvas background to deselect.
   */
  function handleCanvasClick(e: React.MouseEvent): void {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  }

  /**
   * Get the label for the active drag overlay.
   */
  function getActiveLabel(): string {
    if (!activeType) return '';
    const item = componentList.find((c: { type: string; label: string; icon: string }) => c.type === activeType);
    return item ? `${item.icon} ${item.label}` : activeType;
  }

  const sortableIds = components.map((c) => c.id);

  return (
    <div className="flex-1 bg-gray-100 overflow-y-auto p-6" onClick={handleCanvasClick}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SimulatedDevice>
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            {components.length === 0 ? (
              <EmptyCanvas />
            ) : (
              components.map((comp) => (
                <SortableCanvasItem
                  key={comp.id}
                  component={comp}
                  isSelected={comp.id === selectedId}
                  onSelect={() => selectComponent(comp.id)}
                />
              ))
            )}
          </SortableContext>
        </SimulatedDevice>

        {/* Drag overlay showing the component being dragged */}
        <DragOverlay>
          {activeId && activeType ? (
            <div className="bg-white border-2 border-blue-400 rounded-lg shadow-xl px-4 py-3 text-sm font-medium text-gray-700">
              {getActiveLabel()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

/**
 * Empty state placeholder when no components are on the canvas.
 */
function EmptyCanvas(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
      <span className="text-5xl mb-4">🎨</span>
      <p className="text-sm">从左侧拖入组件开始搭建</p>
    </div>
  );
}

/** Props for a sortable canvas item. */
interface SortableCanvasItemProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: () => void;
}

/**
 * Merge component props with schema defaults to fill missing values.
 * This prevents render crashes when required props are undefined.
 */
function mergeProps(
  type: string,
  props: Record<string, unknown>,
): Record<string, unknown> {
  const entry = componentRegistry[type];
  if (!entry) return props ?? {};
  const defaults = entry.schema.defaultProps as Record<string, unknown> | undefined;
  if (!defaults) return props ?? {};
  return { ...defaults, ...props };
}

/**
 * A single sortable component rendered on the canvas.
 * Wraps the actual component from the registry and provides
 * click-to-select and drag-to-reorder functionality.
 */
function SortableCanvasItem({ component, isSelected, onSelect }: SortableCanvasItemProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const entry = componentRegistry[component.type];
  const Comp = entry?.component;
  const mergedProps = mergeProps(component.type, component.props as Record<string, unknown>);

  /**
   * Handle click on the component wrapper to select it.
   */
  function handleClick(e: React.MouseEvent): void {
    e.stopPropagation();
    onSelect();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={handleClick}
      className={`relative border-2 rounded transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-transparent hover:border-gray-300'
      } ${isDragging ? 'opacity-50 shadow-lg' : 'opacity-100'}`}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="absolute top-0 right-0 z-10 p-1 cursor-grab active:cursor-grabbing opacity-0 hover:opacity-100 transition-opacity"
      >
        <span className="text-gray-400 text-xs">⠿</span>
      </div>

      {/* Component label badge */}
      {isSelected && entry && (
        <div className="absolute top-0 left-0 z-10 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-br">
          {entry.schema.icon} {entry.schema.label}
        </div>
      )}

      {/* Render the actual component */}
      {Comp ? (
        <Comp {...mergedProps} data={(mergedProps.data as never) ?? []} />
      ) : (
        <div className="p-4 text-sm text-red-400">未知组件: {component.type}</div>
      )}
    </div>
  );
}