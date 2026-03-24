import { Button, Card, Col, Form, Row } from "antd";
import Layout from "../../../../components/layout";
import RoleForm from "../../../../components/pages/user-role/Role/RoleForm";
import TopTitle from "../../../../components/shared/TopTitle";
import { useEffect, useState } from "react";
import RoleService from "../../../../services/RoleService";
import { useRouter } from "next/router";
import { useNotification } from "../../../../components/shared/Notifications";

const EditRolePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();
  const { openNotification, contextHolder } = useNotification();

  useEffect(() => {
    if (!query?.id) return;

    setLoading(true);
    RoleService.findOne(Number(query.id))
      .then(({ data }) => {
        form.setFieldsValue({
          ...data,
          permissions: data.permissions?.map((p) => p.id) ?? [],
          reportPages: data.reportPages?.map((rp) => rp.value) ?? [],
        });
      })
      .finally(() => setLoading(false));
  }, [query]);

  const onFinish = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      await RoleService.update({
        id: Number(query.id),
        name: values.name,
        keyName: values.keyName,
        isActive: !!values.isActive,
        permissionIds: values.permissions || [],
        reportPageIds: values.reportPages || [],
      });

      openNotification("success", "Rol editado exitosamente!");
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
          title={{ title: "Gestión de Roles / Editar rol" }}
        />

        <Row gutter={24} className="create-role__container" justify="center">
          <Col span={12}>
            <Card bordered={false} style={{ padding: "16px" }}>
              <RoleForm form={form} />
              <Row
                gutter={24}
                className="create-role__container"
                justify="center"
                style={{ marginTop: 129 }}
              >
                <Button
                  type="primary"
                  block
                  style={{ width: "50%" }}
                  onClick={onFinish}
                  loading={loading}
                >
                  <span style={{ color: "#fff" }}>Editar rol</span>
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </Layout>
    </>
  );
};

export default EditRolePage;
