'use client';

import { useApp } from '@/hooks/useApp';
import { Badge } from '@/components/ui/badge';

export function ActiveClientBadge() {
  const { activeClientId } = useApp();

  if (!activeClientId) {
    return null;
  }

  // This is a simple badge that shows the client ID
  // In a real implementation, we would get the client name from context or cache
  return (
    <Badge variant="secondary" className="ml-2">
      Cliente ID: {activeClientId}
    </Badge>
  );
}