import React, { useState } from "react";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import Layout from "../../components/layout";
import Monitor from "../../components/pages/monitor";
import { SearchBar } from "../../components/shared/SearchBar/index";
import { useAppContext } from "../../context/AppContext";
import { PERMISSION_TYPE } from "../../shared/enum/permission.enum";
import { PageHeader } from "../../components/layout/PageHeader";

const MonitorPage = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const canCreate = user?.activePermissions?.includes(
    PERMISSION_TYPE.CAN_CREATE_MONITOR
  );

  return (
    <Layout>
      <div className="space-y-4 p-8">
        <PageHeader title="Gestión de Pantallas">
          {canCreate && (
            <button
              onClick={() => router.push("monitor/crear")}
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo monitor
            </button>
          )}
        </PageHeader>
        <SearchBar
          placeholder="Buscar monitor"
          onChange={(v) => setSearch(v || undefined)}
        />
        <Monitor search={search} />
      </div>
    </Layout>
  );
};

export default MonitorPage;
