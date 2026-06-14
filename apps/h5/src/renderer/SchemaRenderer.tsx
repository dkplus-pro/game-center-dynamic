import React from 'react';
import { componentRegistry } from '@game-center/components';
import type { PageComponent } from '@game-center/types';
import { ErrorBoundary } from './ErrorBoundary';
import { DataProvider } from './DataProvider';
import type { GameInfo } from '@game-center/types';

/**
 * Props for the SchemaRenderer component.
 */
interface SchemaRendererProps {
  /** Ordered array of page components from the page schema. */
  components: PageComponent[];
}

/**
 * Props for a single rendered component, parsed from its JSON.
 */
interface ParsedComponentProps {
  /** Backend-resolved game data (embedded when ?resolve=true). */
  resolvedData?: GameInfo[];
  /** All other props defined by the component's schema. */
  [key: string]: unknown;
}

/**
 * ComponentErrorFallback — Inline fallback for a single failed component.
 *
 * Displays a compact red badge so the user knows a component
 * couldn't render, but the rest of the page stays intact.
 *
 * @param type - The component type string that failed.
 */
function ComponentErrorFallback({ type }: { type: string }): React.JSX.Element {
  return (
    <div className="m-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
      ⚠️ 组件 &quot;{type}&quot; 渲染失败，已跳过
    </div>
  );
}

/**
 * SchemaRenderer — Core engine that parses a page schema and renders components.
 *
 * Workflow:
 * 1. Sort components by `order` field.
 * 2. For each component, parse `propsJson` into a typed object.
 * 3. Look up the component type in `componentRegistry`.
 * 4. Unknown types → skip with a console warning (Layer 1 fallback).
 * 5. Wrap each component in:
 *    - `ErrorBoundary` (catches render errors per component)
 *    - `DataProvider` (passes resolved data as render prop)
 * 6. Render the registry component with merged props + data.
 *
 * @param props - Schema renderer props.
 */
export function SchemaRenderer({
  components,
}: SchemaRendererProps): React.JSX.Element {
  // 1. Sort by order
  const sorted = [...components].sort((a, b) => a.order - b.order);

  return (
    <div className="schema-renderer space-y-4 pb-8">
      {sorted.map((comp) => {
        // 2. Extract props — backend returns `props` as object, or `propsJson` as JSON string
        let parsed: ParsedComponentProps;
        const rawProps = (comp as unknown as Record<string, unknown>).props;
        const rawPropsJson = comp.propsJson;
        try {
          if (typeof rawProps === 'object' && rawProps !== null) {
            parsed = rawProps as ParsedComponentProps;
          } else if (typeof rawPropsJson === 'string') {
            parsed = JSON.parse(rawPropsJson) as ParsedComponentProps;
          } else {
            console.warn(
              `[SchemaRenderer] No props found for component "${comp.type}" (id: ${comp.id})`,
            );
            return null;
          }
        } catch {
          console.warn(
            `[SchemaRenderer] Failed to parse props for component "${comp.type}" (id: ${comp.id})`,
          );
          return null;
        }

        // 3. Get component from registry
        const entry = componentRegistry[comp.type];

        // 4. Unknown type → skip (Layer 1 fallback)
        if (!entry) {
          console.warn(
            `[SchemaRenderer] Unknown component type: "${comp.type}"`,
          );
          return null;
        }

        const { resolvedData, ...restProps } = parsed;

        // 5. Wrap in ErrorBoundary + DataProvider, render with merged props + data
        return (
          <ErrorBoundary
            key={comp.id}
            fallback={<ComponentErrorFallback type={comp.type} />}
          >
            <DataProvider resolvedData={resolvedData}>
              {(data) => {
                const Comp = entry.component;
                return <Comp {...restProps} data={data} />;
              }}
            </DataProvider>
          </ErrorBoundary>
        );
      })}
    </div>
  );
}