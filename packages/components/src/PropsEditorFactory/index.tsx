import React from 'react';
import type { ComponentSchema, PropMeta } from '../types';

interface PropsEditorFactoryProps {
  schema: ComponentSchema;
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}

/**
 * Generic form generator that reads a ComponentSchema's propsMeta
 * and renders the appropriate form control for each property.
 *
 * Supported control types: text, boolean, select, color, image-list,
 * game-data-source, number.
 */
export function PropsEditorFactory({ schema, values, onChange }: PropsEditorFactoryProps): React.JSX.Element {
  const entries = Object.entries(schema.propsMeta);

  /**
   * Updates a single property value without mutating the original object.
   */
  function handleChange(key: string, value: unknown): void {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([key, meta]) => (
        <div key={key} className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 w-24 shrink-0">{meta.label}</label>
          <div className="flex-1">
            <PropControl
              keyName={key}
              meta={meta}
              value={values[key]}
              defaultVal={schema.defaultProps[key]}
              onChange={handleChange}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Props for the PropControl sub-component. */
interface PropControlProps {
  keyName: string;
  meta: PropMeta;
  value: unknown;
  defaultVal: unknown;
  onChange: (key: string, value: unknown) => void;
}

/**
 * Renders the appropriate form control based on PropMeta type.
 * Extracted as a standalone component to avoid nested-switch parser issues.
 */
function PropControl({ keyName, meta, value, defaultVal, onChange }: PropControlProps): React.JSX.Element | null {
  switch (meta.type) {
    case 'text':
      return (
        <input
          type="text"
          value={String(value ?? defaultVal ?? '')}
          maxLength={meta.maxLength}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          onChange={(e) => onChange(keyName, e.target.value)}
        />
      );

    case 'boolean':
      return (
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={Boolean(value ?? defaultVal ?? false)}
            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
            onChange={(e) => onChange(keyName, e.target.checked)}
          />
          <span className="text-xs text-gray-500">
            {Boolean(value ?? defaultVal ?? false) ? '已启用' : '已关闭'}
          </span>
        </label>
      );

    case 'select': {
      const options = (meta as { options: { label: string; value: string }[] }).options;
      const selected = String(value ?? defaultVal ?? options[0]?.value ?? '');
      return (
        <select
          value={selected}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          onChange={(e) => onChange(keyName, e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    case 'color':
      return (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={String(value ?? defaultVal ?? '#ffffff')}
            className="h-8 w-12 cursor-pointer rounded border border-gray-300"
            onChange={(e) => onChange(keyName, e.target.value)}
          />
          <span className="text-xs text-gray-500">
            {String(value ?? defaultVal ?? '#ffffff')}
          </span>
        </div>
      );

    case 'image-list': {
      const raw = String(value ?? '');
      const urls = raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
      const maxCount = (meta as { maxCount?: number }).maxCount;
      return (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={raw}
            placeholder="图片URL，多个用逗号分隔"
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            onChange={(e) => onChange(keyName, e.target.value)}
          />
          {urls.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {urls.slice(0, maxCount ?? 5).map((url, i) => (
                <img key={i} src={url} alt={`图片 ${i + 1}`} className="h-12 w-12 rounded object-cover" />
              ))}
            </div>
          )}
        </div>
      );
    }

    case 'game-data-source': {
      const ds = (value as { type: 'filter' | 'manual'; filters?: Record<string, unknown>; gameIds?: string[] }) ??
        (defaultVal as { type: 'filter' | 'manual'; filters?: Record<string, unknown>; gameIds?: string[] });
      const dsType = ds?.type ?? 'filter';
      return (
        <div className="flex flex-col gap-2">
          <select
            value={dsType}
            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
            onChange={(e) => {
              const newType = e.target.value as 'filter' | 'manual';
              onChange(
                keyName,
                newType === 'filter'
                  ? { type: 'filter', filters: { tags: [], sortBy: 'rating', limit: 8 } }
                  : { type: 'manual', gameIds: [] },
              );
            }}
          >
            <option value="filter">规则圈选</option>
            <option value="manual">手动选择</option>
          </select>
          {dsType === 'filter' && (
            <div className="flex flex-col gap-1 pl-2 border-l-2 border-blue-200">
              <label className="text-xs text-gray-500">排序方式</label>
              <select
                value={String(ds?.filters?.sortBy ?? 'rating')}
                className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                onChange={(e) => {
                  onChange(keyName, {
                    ...(ds as object),
                    type: 'filter',
                    filters: { ...ds?.filters, sortBy: e.target.value },
                  });
                }}
              >
                <option value="rating">按评分</option>
                <option value="newest">按最新</option>
                <option value="popular">按热度</option>
              </select>
              <label className="text-xs text-gray-500 mt-1">数量限制</label>
              <input
                type="number"
                value={Number(ds?.filters?.limit ?? 8)}
                min={1}
                max={50}
                className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                onChange={(e) => {
                  onChange(keyName, {
                    ...(ds as object),
                    type: 'filter',
                    filters: { ...ds?.filters, limit: Number(e.target.value) },
                  });
                }}
              />
            </div>
          )}
          {dsType === 'manual' && (
            <div className="pl-2 border-l-2 border-green-200">
              <input
                type="text"
                placeholder="游戏ID，逗号分隔"
                value={ds?.gameIds?.join(',') ?? ''}
                className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                onChange={(e) => {
                  onChange(keyName, {
                    type: 'manual',
                    gameIds: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  });
                }}
              />
            </div>
          )}
        </div>
      );
    }

    case 'number':
      return (
        <input
          type="number"
          value={Number(value ?? defaultVal ?? 0)}
          min={meta.min}
          max={meta.max}
          step={meta.step}
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
          onChange={(e) => onChange(keyName, Number(e.target.value))}
        />
      );

    default:
      return null;
  }
}