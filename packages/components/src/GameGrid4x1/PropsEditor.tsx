import React from 'react';
import { PropsEditorFactory } from '../PropsEditorFactory';
import { GameGrid4x1Schema } from './schema';

/**
 * Props editor wrapper for the GameGrid4x1 component.
 * Delegates form generation to PropsEditorFactory.
 */
export function GameGrid4x1PropsEditor(props: {
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}): React.JSX.Element {
  return <PropsEditorFactory schema={GameGrid4x1Schema} values={props.values} onChange={props.onChange} />;
}