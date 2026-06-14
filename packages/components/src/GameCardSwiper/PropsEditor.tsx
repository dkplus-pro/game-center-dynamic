import React from 'react';
import { PropsEditorFactory } from '../PropsEditorFactory';
import { GameCardSwiperSchema } from './schema';

/**
 * Props editor wrapper for the GameCardSwiper component.
 * Delegates form generation to PropsEditorFactory.
 */
export function GameCardSwiperPropsEditor(props: {
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}): React.JSX.Element {
  return <PropsEditorFactory schema={GameCardSwiperSchema} values={props.values} onChange={props.onChange} />;
}