import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import { ItemType } from "antd/es/menu/hooks/useItems";
import { ReactNode } from "react";
import { ActionMenuStyle } from "./style";

interface ActionMenuProps {
  options?: {
    onClick?(): void;
    key: string | number;
    label: string;
    // icon?: ReactNode;
    // option: ReactNode | string;
  }[];
  item?: any;
  loading?: boolean;
}

const ActionMenu = ({ options, item, loading }: ActionMenuProps) => {
  return (
    <ActionMenuStyle>
      <div className="action-menu-container">
        <Dropdown
          trigger={["click"]}
          placement="bottom"
          menu={{ items: options as any }}
          className="action-menu-container__body"
          overlayClassName="action-menu-container__body"
        >
          <Button shape="circle" icon={<EllipsisOutlined />} />
        </Dropdown>
      </div>
    </ActionMenuStyle>
  );
};

export default ActionMenu;
