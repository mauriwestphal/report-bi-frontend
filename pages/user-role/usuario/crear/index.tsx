import { Button, Card, Col, Form, message, Row } from "antd";
import { useState } from "react";
import Layout from "../../../../components/layout";
import UserForm from "../../../../components/pages/user-role/User/UserForm";
import TopTitle from "../../../../components/shared/TopTitle";
import UserService, {
  UserServiceDto,
} from "../../../../services/UserService/services";

const CreateUserPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const onFinish = async () => {
    const values: UserServiceDto = await form.validateFields();

    
    setLoading(true);
    UserService.create(values)
      .then(() => {
        message.success("Usuario creado correctamente!");
        form.resetFields();
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
          title: "Gestión de Usuarios / Crear nuevo usuario",
        }}
      />

      <Row gutter={24} className="create-user__container" justify={"center"}>
        <Col span={12} style={{
          justifyContent:'center'
        }}>
          <Card bordered={false} style={{ padding: "16px", justifyContent:'center', alignContent:'center', alignItems:'center' }}>
            <UserForm form={form} />
            <Row gutter={24} className="create-user__container" justify={"center"} style={{
              marginTop:126
            }}>
            <Button
            type="primary"
            block
            style={{ width: "50%"}}
            onClick={onFinish}
            loading={loading}
          >
            <span style={{
               color: "#fff" 
            }}>

            Crear nuevo usuario

            </span>

          </Button>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default CreateUserPage;
