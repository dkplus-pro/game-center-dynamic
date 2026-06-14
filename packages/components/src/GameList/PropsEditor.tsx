import React from 'react';
import { PropsEditorFactory } from '../PropsEditorFactory';
import { GameListSchema } from './schema';

/**
 * Props editor wrapper for the GameList component.
 * Delegates form generation to PropsEditorFactory.
 */
export function GameListPropsEditor(props: {
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}): React.JSX.Element {
  return <PropsEditorFactory schema={GameListSchema} values={props.values} onChange={props.onChange} />;
}