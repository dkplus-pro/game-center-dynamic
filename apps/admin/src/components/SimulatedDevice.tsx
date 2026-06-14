import React from 'react';

/**
 * Simulated iPhone device frame that wraps preview content.
 * Shows a faux status bar and renders children inside a phone-shaped container.
 */
export function SimulatedDevice({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div
      className="mx-auto overflow-hidden rounded-[40px] shadow-2xl border-8 border-gray-800 bg-white"
      style={{ width: 375, minHeight: 667 }}
    >
      {/* Faux status bar */}
      <div className="h-11 bg-gray-900 flex items-center justify-between px-6 text-white text-xs">
        <span>9:41</span>
        <span className="flex gap-1">
          <span className="text-[10px]">●●●●○</span>
          <span>WiFi</span>
          <span>🔋</span>
        </span>
      </div>
      {/* Content area */}
      <div className="min-h-[600px]">{children}</div>
    </div>
  );
}