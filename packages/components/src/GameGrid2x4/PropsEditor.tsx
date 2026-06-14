import React from 'react';
import { PropsEditorFactory } from '../PropsEditorFactory';
import { GameGrid2x4Schema } from './schema';

/**
 * Props editor wrapper for the GameGrid2x4 component.
 * Delegates form generation to PropsEditorFactory.
 */
export function GameGrid2x4PropsEditor(props: {
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}): React.JSX.Element {
  return <PropsEditorFactory schema={GameGrid2x4Schema} values={props.values} onChange={props.onChange} />;
}