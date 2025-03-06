import Layout from "../../../../components/layout";
import RoleForm from "../../../../components/pages/user-role/Role/RoleForm";
import TopTitle from "../../../../components/shared/TopTitle";
import { useState } from "react";
import RoleService from "../../../../services/RoleService";
import { Button, Card, Col, Form, message, Row } from "antd";
import { useNotification } from "../../../../components/shared/Notifications";

export default function CreateRolePage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { openNotification , contextHolder} = useNotification()
  const onFinish = async () => {
    try {
      // setLoading(true);
      const values = await form.validateFields();

      RoleService.create({
        ...values,
        permissions: values.permissions
          ? values.permissions.map((permission: any) => ({ id: permission }))
          : [],
          reportPages: values.reportPages
          ? values.reportPages.map((reportPage: any) => ({ id: reportPage})): [],
        isActive: !!values.isActive,
      })
        .then(() => {
          openNotification('success', 'Se creo el rol de manera correcta');
          form.resetFields();
        })
        .catch((reason) => {
          openNotification('error', reason.message);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
      console.error("Not validated fields");
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
        title={{
          title: "Gestión de Roles / Crear nuevo rol",
        }}
      />

      <Row gutter={24} className="create-role__container" justify={"center"}>
        <Col span={12}>
          <Card bordered={false} style={{ padding: "16px" }}>
            <RoleForm form={form} />
            <Row
              gutter={24}
              className="create-role__container"
              justify={"center"}
              style={{
                marginTop: 126,
              }}
            >
              <Button
                type="primary"
                block
                style={{ width: "50%" }}
                onClick={onFinish}
                loading={loading}
              >
                <span style={{ color: "#fff" }}>
                Crear nuevo rol
                </span>
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
    </>

  );
}
