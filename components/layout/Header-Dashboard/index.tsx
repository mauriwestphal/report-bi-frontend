import React from "react";

export default function HeaderDashboard() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center px-6">
        <span className="text-lg font-bold tracking-tight select-none">
          Bi<span className="text-primary">Pro</span>
        </span>
      </div>
    </header>
  );
}
