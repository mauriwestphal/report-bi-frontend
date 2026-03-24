import { Button, Card, Col, Form, message, Row, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../../components/layout";
import UserForm from "../../../../components/pages/user-role/User/UserForm";
import TopTitle from "../../../../components/shared/TopTitle";
import UserService from "../../../../services/UserService/services";

const UpdateUserPage = () => {
  const [form] = Form.useForm();
  const userId = Form.useWatch("id", form);
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.id) {
      setLoading(true);
      UserService.get(Number(query.id))
        .then(({ data }) => {
          form.setFieldsValue({
            id: data.id,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            isActive: data.isActive,
            roleId: data.role?.id,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  const onFinish = async () => {
    const values = await form.validateFields();

    const payload = {
      id: values.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      roleId: values.roleId,
      isActive: values.isActive,
    };

    setLoading(true);
    UserService.update(payload)
      .then(() => {
        message.success("Usuario editado correctamente");
      })
      .catch((reason: any) => {
        if (reason?.statusCode === 409 || reason?.status === 409) {
          message.error(
            "Ya existe un usuario con ese correo electrónico."
          );
        } else {
          message.error(reason?.message || "Error al editar el usuario");
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
          title: "Gestión de Usuarios / Editar usuario",
        }}
      />

      <Row gutter={24} className="update-user__container" justify="center">
        <Col span={12}>
          <Spin spinning={loading}>
            <Card bordered={false} style={{ padding: "16px" }}>
              <UserForm form={form} />
              <Row
                gutter={24}
                className="update-user__container"
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
                  Editar usuario
                </Button>
              </Row>
            </Card>
          </Spin>
        </Col>
      </Row>
    </Layout>
  );
};

export default UpdateUserPage;
