import React from 'react';
import type { GameInfo } from '@game-center/components';

/**
 * Props for the DataProvider component.
 */
interface DataProviderProps {
  /** Game data pre-resolved by the backend (embedded in page API response). */
  resolvedData?: GameInfo[];
  /** Render-prop child that receives the resolved data. */
  children: (data: GameInfo[] | undefined) => React.ReactNode;
}

/**
 * DataProvider — Pass-through wrapper for backend-resolved game data.
 *
 * The backend's `GET /api/pages/:slug?resolve=true` endpoint
 * already embeds resolved `GameInfo[]` into each component's
 * `resolvedData` field, so no client-side data fetching is
 * needed here.
 *
 * Layer 2 fallback: when `resolvedData` is undefined (e.g. the
 * API was called without `resolve=true`), the child component
 * receives `undefined` and is expected to handle the empty
 * / loading state internally.
 *
 * @param props - Data provider props.
 */
export function DataProvider({
  resolvedData,
  children,
}: DataProviderProps): React.JSX.Element {
  return <>{children(resolvedData)}</>;
}