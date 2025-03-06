import { Button, Card, Col, Form, message, Row, Spin } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { format } from "rut.js";
import Layout from "../../../../components/layout";
import UserForm from "../../../../components/pages/user-role/User/UserForm";
import TopTitle from "../../../../components/shared/TopTitle";
import UserService, {
  UserUpdateDto,
} from "../../../../services/UserService/services";

const UpdateUserPage = () => {
  const [form] = Form.useForm();
  const userId = Form.useWatch("id", form);
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (query.id) {
      UserService.get(Number(query.id)).then(({ data }) => {

        const { rut, dv } = data;
        if (rut && dv) {
          data.rut = format(`${rut}${dv}`);
        }

        form.setFieldsValue({          
          ...data,
        });
      }).finally(() => setLoading(false));
    }
  }, [query]);

  const onFinish = async () => {
    const values: UserUpdateDto = await form.validateFields();
    setLoading(true);
    UserService.update(values)
      .then(() => {
        message.success("Usuario editado correctamente");
        form.resetFields();
        setLoading(false);
      })
      .catch((reason) => {
        message.error(reason.message);
      })
      .finally(() => setLoading(false));
  };
  return (
    <Layout>
      <TopTitle
        comeBackConfig={{
          route: "/home",
          show: true,
          text: "Volver a Usuarios",
        }}
        title={{
          title: "Gestión de Usuarios / Editar usuario",
        }}
      />

      <Row gutter={24} className="update-user__container" justify={"center"}>
        <Col span={12}>
          <Spin spinning={loading}>
            <Card bordered={false} style={{ padding: "16px" }}>
              <UserForm form={form} />
              <Row gutter={24} className="update-user__container" justify={"center"}>
                <Button
                  type="primary"
                  block
                  style={{ width: "50%" }}
                  onClick={onFinish}
                  loading={loading}
                >
                 <span style={{
                    color: "#fff"
                  }}> 
                  Editar usuario
                  </span>
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
