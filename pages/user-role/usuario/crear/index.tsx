import { Button, Card, Col, Form, message, Row } from "antd";
import { useState } from "react";
import Layout from "../../../../components/layout";
import UserForm from "../../../../components/pages/user-role/User/UserForm";
import TopTitle from "../../../../components/shared/TopTitle";
import UserService from "../../../../services/UserService/services";

const CreateUserPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    const values = await form.validateFields();

    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleId: values.roleId,
      isActive: values.isActive ?? true,
    };

    setLoading(true);
    UserService.create(payload)
      .then(() => {
        message.success("Usuario creado correctamente!");
        form.resetFields();
      })
      .catch((reason: any) => {
        if (reason?.statusCode === 409 || reason?.status === 409) {
          message.error(
            "Ya existe un usuario con ese correo electrónico. Por favor verifica los datos."
          );
        } else {
          message.error(reason?.message || "Error al crear el usuario");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Layout>
      <TopTitle
        comeBackConfig={{
          route: "/user-role",
          show: true,
          text: "Volver a Usuarios",
        }}
        title={{
          title: "Gestión de Usuarios / Crear nuevo usuario",
        }}
      />

      <Row gutter={24} className="create-user__container" justify="center">
        <Col span={12}>
          <Card bordered={false} style={{ padding: "16px" }}>
            <UserForm form={form} />
            <Row
              gutter={24}
              className="create-user__container"
              justify="center"
              style={{ marginTop: 40 }}
            >
              <Button
                type="primary"
                block
                style={{ width: "50%" }}
                onClick={onFinish}
                loading={loading}
              >
                Crear nuevo usuario
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default CreateUserPage;
