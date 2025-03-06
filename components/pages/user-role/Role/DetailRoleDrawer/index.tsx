import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Col, Drawer, Row, Skeleton } from "antd";
import { useEffect, useState } from "react";
import RoleService from "../../../../../services/RoleService";
import { UserInterface } from "../../../../layout/interfaces";
import { DetailRoleDrawerBodyStyle, DetailRoleDrawerStyled } from "./style";

const closeDrawerButton = (onClick: any) => {
  return (
    <Button
      type="default"
      icon={<CloseOutlined />}
      onClick={onClick}
      className="round-icon-button"
    />
  );
};

interface IDetailRoleDrawerProps {
  id: number;
  onClose: () => void;
}

const DetailRoleDrawer = ({ id, onClose }: IDetailRoleDrawerProps) => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      onClose();
      setUsers([]);
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    if (id) {
      RoleService.findOne(id)
        .then(({ data }) => {
          const { name, users } = data;
          setRoleName(name);

          if (users) {
            setUsers(users);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <DetailRoleDrawerStyled>
      <Drawer
        title={`Detalle`}
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
              <Skeleton loading={loading}>
                <p className="role-description">{roleName}</p>
              </Skeleton>
            </div>

            <div className="user-count-container">
              <p>Usuarios asociados al rol</p>
            </div>
            <Skeleton loading={loading}>
              <Card bordered={false}>
                <ul>
                  {users.map((user) => (
                    <li
                      key={user.id}
                    >{`${user.firstName} ${user.lastName}`}</li>
                  ))}
                </ul>
              </Card>
            </Skeleton>

            <Row style={{ marginTop: "70px" }} justify="center">
              <Col span={12}>
                <Button type="primary" block onClick={() => onClose()}>
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
