import { CloseOutlined } from "@ant-design/icons";
import { Badge, Button, Card, Col, Drawer, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import RoleService from "../../../../../services/RoleService";
import { IPermission, IReportPage, RoleInterface } from "../../../../layout/interfaces";
import { DetailRoleDrawerBodyStyle, DetailRoleDrawerStyled } from "./style";

const closeDrawerButton = (onClick: () => void) => (
  <Button
    type="default"
    icon={<CloseOutlined />}
    onClick={onClick}
    className="round-icon-button"
  />
);

interface IDetailRoleDrawerProps {
  id: number;
  onClose: () => void;
}

interface IPermissionGroup {
  groupName: string;
  permissions: IPermission[];
}

const groupPermissions = (permissions: IPermission[]): IPermissionGroup[] => {
  const map: Record<string, IPermission[]> = {};
  permissions.forEach((p) => {
    const group = p.groupName || "General";
    if (!map[group]) map[group] = [];
    map[group].push(p);
  });
  return Object.entries(map).map(([groupName, perms]) => ({
    groupName,
    permissions: perms,
  }));
};

const DetailRoleDrawer = ({ id, onClose }: IDetailRoleDrawerProps) => {
  const [role, setRole] = useState<RoleInterface | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setRole(null);
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    RoleService.findOne(id)
      .then(({ data }) => setRole(data))
      .finally(() => setLoading(false));
  }, [id]);

  const permissionGroups = role?.permissions
    ? groupPermissions(role.permissions)
    : [];

  return (
    <DetailRoleDrawerStyled>
      <Drawer
        title="Detalle de rol"
        placement="right"
        onClose={onClose}
        open={!!id}
        extra={closeDrawerButton(onClose)}
        closable={false}
        rootClassName="detail-role-drawer"
      >
        <DetailRoleDrawerBodyStyle>
          <div className="detail-role-drawer__body">
            <div className="role-name-container">
              <p className="role-name">Rol</p>
              <Skeleton loading={loading} active paragraph={{ rows: 1 }}>
                <p className="role-description">{role?.name}</p>
                <Badge
                  color={role?.isActive ? "#79BB61" : "#DF545C"}
                  text={role?.isActive ? "Activo" : "Inactivo"}
                />
              </Skeleton>
            </div>

            <div className="user-count-container">
              <p>Permisos asignados</p>
            </div>

            <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
              {permissionGroups.length > 0 ? (
                permissionGroups.map((group) => (
                  <Card
                    key={group.groupName}
                    bordered={false}
                    style={{ marginBottom: 12 }}
                  >
                    <p
                      style={{
                        fontWeight: 700,
                        marginBottom: 8,
                        textTransform: "capitalize",
                      }}
                    >
                      {group.groupName}
                    </p>
                    <ul>
                      {group.permissions.map((perm) => (
                        <li key={perm.id} style={{ marginBottom: 6 }}>
                          {perm.name}
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))
              ) : (
                <p style={{ color: "#888" }}>Sin permisos asignados.</p>
              )}
            </Skeleton>

            {role?.reportPages && role.reportPages.length > 0 && (
              <>
                <div className="user-count-container" style={{ marginTop: 16 }}>
                  <p>Páginas de reporte</p>
                </div>
                <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
                  <Card bordered={false}>
                    <ul>
                      {role.reportPages.map((rp: IReportPage) => (
                        <li key={rp.value ?? rp.id}>{rp.label}</li>
                      ))}
                    </ul>
                  </Card>
                </Skeleton>
              </>
            )}

            <Row style={{ marginTop: "70px" }} justify="center">
              <Col span={12}>
                <Button type="primary" block onClick={onClose}>
                  Cerrar
                </Button>
              </Col>
            </Row>
          </div>
        </DetailRoleDrawerBodyStyle>
      </Drawer>
    </DetailRoleDrawerStyled>
  );
};

export default DetailRoleDrawer;
