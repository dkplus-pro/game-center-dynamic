import React, { Suspense } from 'react';
import { componentRegistry } from '@game-center/components';
import { PropsEditorFactory } from '@game-center/components';
import { useEditorStore } from '../stores/useEditorStore';

/**
 * Right panel for editing the properties of the selected component.
 * Shows the component's PropsEditor (lazy-loaded) or falls back to
 * PropsEditorFactory for generic form generation.
 *
 * When no component is selected, shows a placeholder message.
 */
export function PropsPanel(): React.JSX.Element {
  const selectedId = useEditorStore((s) => s.selectedId);
  const components = useEditorStore((s) => s.components);
  const updateComponentProps = useEditorStore((s) => s.updateComponentProps);

  // Find the selected component instance
  const selectedComp = selectedId ? components.find((c) => c.id === selectedId) : undefined;

  /**
   * Handle prop changes from the editor.
   */
  function handleChange(values: Record<string, unknown>): void {
    if (selectedId) {
      updateComponentProps(selectedId, values);
    }
  }

  return (
    <aside className="w-[280px] shrink-0 bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="h-12 flex items-center px-4 border-b border-gray-200 bg-white">
        <h2 className="text-sm font-semibold text-gray-700">属性面板</h2>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {!selectedComp && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-4xl mb-3">👆</span>
            <p className="text-sm">点击组件编辑属性</p>
          </div>
        )}

        {selectedComp && (
          <PropsEditorContent
            componentType={selectedComp.type}
            values={selectedComp.props}
            onChange={handleChange}
          />
        )}
      </div>
    </aside>
  );
}

/** Props for the PropsEditorContent sub-component. */
interface PropsEditorContentProps {
  componentType: string;
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}

/**
 * Renders the appropriate props editor for the selected component type.
 * Tries the lazy-loaded PropsEditor first, falls back to PropsEditorFactory.
 */
function PropsEditorContent({ componentType, values, onChange }: PropsEditorContentProps): React.JSX.Element {
  const entry = componentRegistry[componentType];

  if (!entry) {
    return (
      <div className="text-sm text-red-500">
        未找到组件类型: {componentType}
      </div>
    );
  }

  const { schema, PropsEditor } = entry;

  return (
    <div>
      {/* Component type badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">{schema.icon}</span>
        <span className="text-sm font-medium text-gray-700">{schema.label}</span>
        <span className="text-xs text-gray-400">{componentType}</span>
      </div>

      {/* Lazy-loaded PropsEditor with Suspense boundary */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8 text-gray-400">
            <span className="text-sm">加载属性编辑器...</span>
          </div>
        }
      >
        <PropsEditor values={values} onChange={onChange} />
      </Suspense>

      {/* Fallback: generic PropsEditorFactory for all schema fields */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 mb-2">通用属性</p>
        <PropsEditorFactory schema={schema} values={values} onChange={onChange} />
      </div>
    </div>
  );
}