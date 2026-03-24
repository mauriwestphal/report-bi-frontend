import React, { useEffect, useState } from "react";
import { lastUpdate } from "../../../services/Dashboard";

export default function HeaderDashboard() {
  const [lastUpdateTime, setLastUpdateTime] = useState<string | undefined>();

  useEffect(() => {
    lastUpdate()
      .then(({ data }: any) => {
        setLastUpdateTime(data?.[0]?.SYNCSTARTDATETIME);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        <span className="text-lg font-bold tracking-tight pr-4 mr-4 border-r border-border select-none">
          Bi<span className="text-primary">Pro</span>
        </span>
        <span className="text-sm font-medium">Dashboard 360</span>

        {lastUpdateTime && (
          <div className="ml-auto">
            <span className="text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-md border border-border">
              {`Última actualización ${lastUpdateTime} hrs`}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
