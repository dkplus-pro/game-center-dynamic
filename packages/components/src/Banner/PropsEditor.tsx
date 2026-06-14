import React from 'react';
import { PropsEditorFactory } from '../PropsEditorFactory';
import { BannerSchema } from './schema';

/**
 * Props editor wrapper for the Banner component.
 * Delegates form generation to PropsEditorFactory.
 */
export function BannerPropsEditor(props: {
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
}): React.JSX.Element {
  return <PropsEditorFactory schema={BannerSchema} values={props.values} onChange={props.onChange} />;
}