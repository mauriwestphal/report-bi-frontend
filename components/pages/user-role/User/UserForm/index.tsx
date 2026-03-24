import {
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import RoleService from "../../../../../services/RoleService";
import RoleInterface from "../../../../../shared/interfaces/Role.interface";

interface UserFormProps {
  form: FormInstance<any>;
}

interface Roles {
  data: RoleInterface[];
  loading: boolean;
}

const UserForm = ({ form }: UserFormProps) => {
  const [roles, setRoles] = useState<Roles>({ loading: false, data: [] });

  useEffect(() => {
    setRoles({ loading: true, data: [] });
    RoleService.list({}).then(({ data }) => {
      setRoles({ data: data as RoleInterface[], loading: false });
    });
  }, []);

  return (
    <Form form={form} layout="vertical">
      <div style={{ marginBottom: 29, marginTop: 15 }}>
        <strong>Información del usuario</strong>
      </div>

      <Row gutter={40}>
        <Col span={0}>
          <Form.Item name="id" />
        </Col>

        <Col span={12}>
          <Form.Item
            name="firstName"
            label="Nombre"
            rules={[{ required: true, message: "El nombre es obligatorio" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Apellido"
            rules={[{ required: true, message: "El apellido es obligatorio" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, message: "El email es obligatorio" },
              { type: "email", message: "Ingresa un email válido" },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="isActive" valuePropName="checked" label="Estado">
            <Switch unCheckedChildren="Inactivo" checkedChildren="Activo" />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ marginBottom: 41, marginTop: 40 }}>
        <strong>Asignación de perfil</strong>
      </div>

      <Row gutter={40}>
        <Col span={24}>
          <Form.Item
            name="roleId"
            label="Perfil"
            rules={[{ required: true, message: "El perfil es obligatorio" }]}
          >
            <Select
              placeholder="Seleccionar"
              loading={roles.loading}
              options={roles.data.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserForm;
