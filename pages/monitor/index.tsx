import React, { useState, useEffect } from "react";
import Router from "next/router";
import Layout from "../../components/layout";
import Monitor from "../../components/pages/monitor";
import TopTitle from "../../components/shared/TopTitle";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useAppContext } from "../../context/AppContext";
import { PERMISSION_TYPE } from "../../shared/enum/permission.enum";

const MonitorPage = () => {
  const { user } = useAppContext();
  const [search, setSearch] = useState<string | undefined>(undefined);

  const canCreate = user?.activePermissions?.includes(
    PERMISSION_TYPE.CAN_CREATE_MONITOR
  );

  useEffect(() => {
    if (!user) {
      Router.push("/auth");
    }
  }, []);

  return (
    <Layout>
      <TopTitle
        comeBackConfig={{ show: false }}
        showDate={false}
        title={{ title: "Gestión de Pantallas" }}
        search={{
          placeholder: "Buscar monitor",
          onClick: (value: string) => setSearch(value || undefined),
        }}
        action={
          canCreate
            ? {
                buttonText: "Nuevo monitor",
                icon: <PlusCircleOutlined />,
                onClick: () => Router.push("monitor/crear"),
              }
            : undefined
        }
      />

      <Monitor search={search} />
    </Layout>
  );
};

export default MonitorPage;
