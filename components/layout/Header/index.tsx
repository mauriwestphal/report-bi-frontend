import { Avatar, Dropdown, Layout, Menu } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { HeaderStyled } from "./styled";
import { useRouter } from "next/router";
import { removeToken } from "../../../utils/auth";
import { useAppContext } from "../../../context/AppContext";
import { PERMISSION_TYPE } from "../../../shared/enum/permission.enum";

const { Header: AntdHeader } = Layout;

const Header = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("inicio");
  const items: any[] = [
    // {
    //   label: "Inicio",
    //   key: "/home",
    //   position: 1
    // },
    // {
    //   label: "Dashboard 360",
    //   key: "/dashboard-usuarios",
    //   position: 2
    // },
    {
      label: "Gestión Monitores",
      key: "/monitor",
      permissions: [
        PERMISSION_TYPE.CAN_CREATE_MONITOR,
        PERMISSION_TYPE.CAN_EDIT_MONITOR,
        PERMISSION_TYPE.CAN_DELETE_MONITOR,
        PERMISSION_TYPE.CAN_GENERATE_NEW_URL,
        PERMISSION_TYPE.CAN_ENABLE_MONITOR,
      ],
      position: 2
    },
    {
      label: "Usuarios y Roles",
      key: "/user-role",
      permissions: [
        PERMISSION_TYPE.CAN_CREATE_ROLE,
        PERMISSION_TYPE.CAN_CREATE_USER,
        PERMISSION_TYPE.CAN_DELETE_ROLE,
        PERMISSION_TYPE.CAN_EDIT_ROLE,
        PERMISSION_TYPE.CAN_EDIT_USER,
        PERMISSION_TYPE.CAN_ENABLE_USER,
      ],
      position: 3
    },
    {
      label: "Reportes",
      key: "/report",
      position: 1
    },
  ];

  useEffect(() => {
    setActiveKey(router.pathname);
  }, [router.pathname]);

  const handleChangeMenu: MenuProps["onClick"] = (e) => {
    setActiveKey(e.key);
    router.push(e.key);
  };

  const handleCloseSession = () => {
    removeToken();
    router.push("/auth");
  };

  const getItems = () => {
    let toShowItems: Array<{label: string, key: string, position: number}> = items.filter(
      (item) => !item.permissions
    );

    for (const item of items.filter((item) => item.permissions)) {
      let hasPermission = false;
      if (item.permissions && item.permissions.length && user) {
        hasPermission = item.permissions.some((permission: PERMISSION_TYPE) =>
          user.activePermissions.includes(permission)
        );
      }
      if (hasPermission) {
        toShowItems.push({ label: item.label, key: item.key, position: item.position });
        toShowItems.sort((a,b) => a.position - b.position);
      }
    }

    return toShowItems;
  };

  return (
    <HeaderStyled>
      <AntdHeader>
        <div className="header_container__content">
          <div>
          <Image
            src="/shared/gama.png"
            alt="gama icon name"
            className="gama-icon"
            width={160}
            height={31}
            style={{
              marginBottom: 20
            }}
               />  
          </div>

        
          {/* MENU CRUD */}
          <div>
            <Menu
              className="route-menu"
              mode="horizontal"
              items={getItems()}
              theme="dark"
              activeKey={activeKey}
              onClick={handleChangeMenu}
              style={{
                minWidth: "600px",
              }}
            />
          </div>
          
          <div className="action-menu-container">
            <Dropdown
              trigger={["hover"]}
              placement="bottom"
              menu={{
                items: [
                  {
                    key: "close-session",
                    theme: "dark",
                    label: "Cerrar sesión",
                    onClick: () => handleCloseSession(),
                  },
                ],
              }}
              className="menu-user-options"
              overlayClassName="menu-user-options__body_black"
            >
              <div>
                <Avatar style={{ backgroundColor: "#f56a00" }}>
                  {(user?.firstName || "").charAt(0)}
                </Avatar>{" "}
                {user?.firstName}
              </div>
            </Dropdown>
          </div>
        </div>
      </AntdHeader>
    </HeaderStyled>
  );
};

export default Header;
