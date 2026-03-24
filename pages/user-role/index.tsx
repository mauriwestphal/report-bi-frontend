import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Plus } from "lucide-react";
import Layout from "../../components/layout";
import UserTab from "../../components/pages/user-role/User";
import RoleTab from "../../components/pages/user-role/Role";
import { PageHeader } from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { useAppContext } from "../../context/AppContext";
import { PERMISSION_TYPE } from "../../shared/enum/permission.enum";

const UserRolePage = () => {
  const router = useRouter();
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState("user");

  // Deep link support: ?active=user|role
  useEffect(() => {
    const active = router.query.active as string;
    if (active === "user" || active === "role") {
      setActiveTab(active);
    }
  }, [router.query.active]);

  const canCreateUser = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_CREATE_USER);
  const canCreateRole = user?.activePermissions?.includes(PERMISSION_TYPE.CAN_CREATE_ROLE);

  return (
    <Layout>
      <div className="space-y-4">
        <PageHeader title="Gestión de Usuarios y Roles" />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="user">Usuarios</TabsTrigger>
              <TabsTrigger value="role">Roles</TabsTrigger>
            </TabsList>

            {activeTab === "user" && canCreateUser && (
              <Button size="sm" onClick={() => router.push("user-role/usuario/crear")}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo usuario
              </Button>
            )}
            {activeTab === "role" && canCreateRole && (
              <Button size="sm" onClick={() => router.push("user-role/rol/crear")}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo rol
              </Button>
            )}
          </div>

          <TabsContent value="user">
            <UserTab />
          </TabsContent>
          <TabsContent value="role">
            <RoleTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserRolePage;
