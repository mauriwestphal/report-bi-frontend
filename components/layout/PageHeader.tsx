'use client';

import { ReactNode } from 'react';
import { ActiveClientBadge } from '@/components/features/clients/ActiveClientBadge';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-xl font-semibold">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ActiveClientBadge />
          {children}
        </div>
      </div>
    </div>
  );
}