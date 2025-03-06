import Layout from "../../components/layout";
import { Tabs } from "antd";
import UserTab from "../../components/pages/user-role/User";
import { UserRoleStyle } from "../../components/pages/user-role/style";
import RoleTab from "../../components/pages/user-role/Role";
import { useEffect, useMemo, useState } from "react";
import TopSearch from "../../components/shared/TopSearch";
import { TopSearchProps } from "../../components/shared/interfaces/TopSearchInterface";
import { PlusCircleOutlined } from "@ant-design/icons";
import Router, { useRouter } from "next/router";
import TopTitle from "../../components/shared/TopTitle";
import { PERMISSION_TYPE } from "../../shared/enum/permission.enum";
import { useAppContext } from "../../context/AppContext";
import { getValidatedItems } from "../../utils/validatedItems";

interface ActiveConfigInterface extends TopSearchProps {
  title?: string;
}

const UserRolePage = () => {
  const router = useRouter();
  const { user } = useAppContext();

  const tabItems = useMemo(
    () => [
      {
        key: "user",
        label: "Usuarios",
        children: <UserTab />,
        action: {
          buttonText: "Nuevo usuario",
          icon: <PlusCircleOutlined />,
          onClick: () => Router.push("user-role/usuario/crear"),
          disabled: !user?.activePermissions.includes(
            PERMISSION_TYPE.CAN_CREATE_USER
          ),
        },
        search: {
          onClick: () => {},
          placeholder: "Buscar usuario",
        },
        title: "Gestión de usuarios",
        permissions: [
          PERMISSION_TYPE.CAN_CREATE_USER,
          PERMISSION_TYPE.CAN_EDIT_USER,
          PERMISSION_TYPE.CAN_ENABLE_USER,
        ],
      },
      {
        key: "role",
        label: "Roles",
        children: <RoleTab />,
        action: {
          buttonText: "Nuevo rol",
          icon: <PlusCircleOutlined />,
          onClick: () => Router.push("user-role/rol/crear"),
        },
        search: {
          onClick: () => {},
          placeholder: "Buscar rol",
        },
        title: "Gestión de roles",
        permissions: [
          PERMISSION_TYPE.CAN_CREATE_ROLE,
          PERMISSION_TYPE.CAN_EDIT_ROLE,
        ],
      },
    ],
    [user?.activePermissions]
  );

  const [activeTab, setActiveTab] = useState<string | string[]>();

  const [activeConfig, setActiveConfig] = useState<
    ActiveConfigInterface | undefined
  >();

  useEffect(() => {
    if (user) {
      const items = getTabItems();

      if (items[0]) {
        updateConfig(items[0].key);
      }
    }
  }, [user?.activePermissions]);
  useEffect(() => {
    if (router.query && router.query.active) {
      setActiveTab(router.query.active);
      updateConfig(router.query.active as string);
    }
  }, [router.query, user?.activePermissions]);

  const handleChangeTab = (key: string) => {
    Router.push(
      {
        pathname: router.pathname,
        query: { active: key },
      },
      undefined,
      { shallow: true }
    );
  };

  const updateConfig = (key: string) => {
    const findItem = tabItems.find((item) => item.key === key);

    if (findItem) {
      setActiveConfig({
        action: findItem.action,
        search: findItem.search,
        title: findItem.title,
      });
    }
  };

  const getTabItems = () => {
    let items = getValidatedItems(tabItems, user?.activePermissions);
    return items;
  };

  return (
    <Layout>
      <TopTitle
        comeBackConfig={{
          route: "/home",
          show: false,
        }}
        title={{
          strong: activeConfig?.title,
        }}

        action={activeConfig?.action}
      />
      {/* <TopSearch action={activeConfig?.action} /> */}
      <UserRoleStyle>
        <Tabs
          onChange={handleChangeTab}
          activeKey={activeTab as string}
          type="card"
          size="middle"
          items={getTabItems()}
          className="user-role-component"
        />
      </UserRoleStyle>
    </Layout>
  );
};

export default UserRolePage;
