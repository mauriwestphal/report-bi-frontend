import { Avatar, Dropdown, Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { HeaderStyled } from "./styled";
import { useRouter } from "next/router";
import { removeToken } from "../../../utils/auth";
import { useAppContext } from "../../../context/AppContext";
import { PERMISSION_TYPE } from "../../../shared/enum/permission.enum";
import { ThemeToggle } from "../../shared/ThemeToggle";
import { LanguageToggle } from "../../shared/LanguageToggle";
import { useTranslations } from "next-intl";

const { Header: AntdHeader } = Layout;

const Header = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const t = useTranslations("nav");
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
      label: t("monitors"),
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
      label: t("usersRoles"),
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
      label: t("reports"),
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px', color: '#fff' }}>
              Bi<span style={{ color: '#3b82f6' }}>Pro</span>
            </span>
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
          
          <div className="action-menu-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LanguageToggle />
            <ThemeToggle />
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
