import { Button, Card, Col, Form, message, Row } from "antd";
import Layout from "../../../../components/layout";
import RoleForm from "../../../../components/pages/user-role/Role/RoleForm";
import TopTitle from "../../../../components/shared/TopTitle";
import { useEffect, useState } from "react";
import RoleService from "../../../../services/RoleService";
import { useRouter } from "next/router";
import { useNotification } from "../../../../components/shared/Notifications";

const CreateRolePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { query } = useRouter();
  const {openNotification, contextHolder} = useNotification()

  useEffect(() => {
    if (query && query.id) {
      setLoading(true);
      const { id } = query;
      RoleService.findOne(Number(id))
        .then(({ data }) => {
          form.setFieldsValue({
            ...data,
            permissions: data.permissions?.map((permission) => permission.id),
            reportPages: data.reportPages?.map((reportPage) => reportPage.value),
          });
        })
        .finally(() => setLoading(false));
    }
  }, [query]);

  const onFinish = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      RoleService.update({
        ...values,
        permissions: values.permissions
          ? values.permissions.map((permission: any) => ({ id: permission }))
          : [],
        reportPages: values.reportPages
          ? values.reportPages.map((reportPage: any) => ({ id: reportPage}))
          : [],
        isActive: !!values.isActive,
      })
        .then(() => {
          openNotification('success', 'Rol editado exitosamente!');
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
          title: "Gestión de Roles / Editar rol",
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
                marginTop: 129,
              }}
            >
              <Button
                type="primary"
                block
                style={{ width: "50%" }}
                onClick={onFinish}
                loading={loading}
              >
                <span
                  style={{
                    color: "#fff",
                  }}
                >
                  Editar rol
                </span>
                
              </Button>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
    </>

  );
};

export default CreateRolePage;
