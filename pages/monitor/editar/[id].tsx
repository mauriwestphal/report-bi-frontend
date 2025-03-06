import { WarningFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, message, Row, Space, notification, Spin } from "antd";
import { useEffect, useState } from "react";

import Layout from "../../../components/layout";
import MonitorForm from "../../../components/pages/monitor/MonitorForm";
import ActionMenuModal from "../../../components/shared/ActionMenuModal";
import TopTitle from "../../../components/shared/TopTitle";
import { useNotification } from "../../../components/shared/Notifications";
import { v4 as uuidv4 } from "uuid";
import ZoneService from "../../../services/ZoneService";
import { useRouter } from "next/router";
import MonitorService from "../../../services/MonitorService/monitor";
import { MonitorInterfaceItem } from "../../../components/layout/interfaces";


type NotificationType = 'success' | 'info' | 'warning' | 'error';

const UpdateMonitorPage = () => {
  const [form] = Form.useForm();
  const userId = Form.useWatch("id", form);
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useNotification()


useEffect(() => {
    if (query.id) {
      MonitorService.getOneMonitor(Number(query.id)).then(({ data }) => {
        form.setFieldsValue({
          ...data, 
        });
        form.setFields([
            {name:'dashboardId', value: isNaN(Number(data.dashboard?.id)) ? 0 : Number(data.dashboard?.id)},
            {name:'report_id', value: isNaN(Number(data.report?.id)) ? 0 : Number(data.report?.id)}
        ]);
      });
    }
  }, [query]);

  const onFinish = async () => {
    const values = await form.validateFields();
    console.log("antes",values);

    values.report_id = parseInt(values.report_id);
    values.dashboardId = parseInt(values.dashboardId);
    console.log("despues",values);
    
    setLoading(true);
    MonitorService.updateMonitor(values)
      .then(() => {
        openNotification('success','Monitor editado correctamente');
      })
      .catch((reason) => {
        openNotification('error', reason.message);
      })
      .finally(() => setLoading(false));
  };



  return (
    <>
      {contextHolder}

      <Layout>
        <TopTitle
          comeBackConfig={{
            route: "/home",
            show: true,
            text: "Volver a Monitor",
          }}
          title={{
            title: "Gestión de Monitores / Crear nuevo Monitor",
          }}
        />

        <Row gutter={24} className="update-monitor__container" justify={"center"}>
          <Col span={12} style={{justifyContent: 'center'}}>
            <Spin spinning={!userId}>
            <Card bordered={false} style={{ padding: "16px", justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <MonitorForm form={form} />
              <Row gutter={24} className="update-monitor__container" justify={"center"} style={{
                marginTop: 100
              }}>
                <Button
                  type="primary"
                  block
                  style={{ width: "50%" }}
                  onClick={onFinish}
                  loading={loading}
                >
                  Actualizar Monitor
                </Button>
              </Row>
            </Card>
            </Spin>
          </Col>
        </Row>
      </Layout>
    </>

  );
};

export default UpdateMonitorPage;
