import React from 'react';

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /** Children to render when no error has occurred. */
  children: React.ReactNode;
  /** Optional custom fallback UI. Defaults to a generic error badge. */
  fallback?: React.ReactNode;
}

/**
 * Internal state for the ErrorBoundary.
 */
interface ErrorBoundaryState {
  /** Whether a child component threw during rendering. */
  hasError: boolean;
}

/**
 * ErrorBoundary — React class-based error boundary.
 *
 * Catches rendering errors from child components and displays a
 * fallback UI instead of crashing the entire page.
 *
 * Layer 1 fallback: component-level rendering error.
 * When a component in the SchemaRenderer throws, this boundary
 * catches it and shows a red error badge so the rest of the page
 * continues to render.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <ComponentThatMayThrow />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Derive error state when a descendant component throws.
   */
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  /**
   * Log error details to the console for debugging.
   */
  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ErrorBoundary] Component rendering error:', error, errorInfo);
  }

  override render(): React.ReactNode {
    if (this.state.hasError) {
      // Layer 1 fallback — generic or custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="m-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          ⚠️ 组件渲染失败，已跳过
        </div>
      );
    }

    return this.props.children;
  }
}