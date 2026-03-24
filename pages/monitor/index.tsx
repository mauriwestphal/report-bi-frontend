import React, { useState } from "react";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import Layout from "../../components/layout";
import Monitor from "../../components/pages/monitor";
import { PageHeader } from "../../components/shared/PageHeader";
import { SearchBar } from "../../components/shared/SearchBar";
import { useAppContext } from "../../context/AppContext";
import { PERMISSION_TYPE } from "../../shared/enum/permission.enum";

const MonitorPage = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const canCreate = user?.activePermissions?.includes(
    PERMISSION_TYPE.CAN_CREATE_MONITOR
  );

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader
          title="Gestión de Pantallas"
          action={
            canCreate
              ? {
                  label: "Nuevo monitor",
                  icon: <Plus className="h-4 w-4" />,
                  onClick: () => router.push("monitor/crear"),
                }
              : undefined
          }
        />
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
