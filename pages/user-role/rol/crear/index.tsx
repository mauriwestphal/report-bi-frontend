import Layout from "../../../../components/layout";
import RoleForm from "../../../../components/pages/user-role/Role/RoleForm";
import TopTitle from "../../../../components/shared/TopTitle";
import { useState } from "react";
import RoleService from "../../../../services/RoleService";
import { Button, Card, Col, Form, Row } from "antd";
import { useNotification } from "../../../../components/shared/Notifications";

export default function CreateRolePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useNotification();

  const onFinish = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      await RoleService.create({
        name: values.name,
        keyName: values.keyName,
        isActive: !!values.isActive,
        permissionIds: values.permissions || [],
        reportPageIds: values.reportPages || [],
      });

      openNotification("success", "Se creó el rol de manera correcta.");
      form.resetFields();
    } catch (err: any) {
      if (err?.message) {
        openNotification("error", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Layout>
        <TopTitle
          comeBackConfig={{
            route: "/user-role?active=role",
            show: true,
            text: "Volver a Roles",
          }}
          title={{ title: "Gestión de Roles / Crear nuevo rol" }}
        />

        <Row gutter={24} className="create-role__container" justify="center">
          <Col span={12}>
            <Card bordered={false} style={{ padding: "16px" }}>
              <RoleForm form={form} />
              <Row
                gutter={24}
                className="create-role__container"
                justify="center"
                style={{ marginTop: 126 }}
              >
                <Button
                  type="primary"
                  block
                  style={{ width: "50%" }}
                  onClick={onFinish}
                  loading={loading}
                >
                  <span style={{ color: "#fff" }}>Crear nuevo rol</span>
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </Layout>
    </>
  );
}
