import { WarningFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, message, Row, Space, notification } from "antd";
import { useEffect, useState } from "react";

import Layout from "../../../components/layout";
import MonitorForm from "../../../components/pages/monitor/MonitorForm";
import ActionMenuModal from "../../../components/shared/ActionMenuModal";
import TopTitle from "../../../components/shared/TopTitle";
import { useNotification } from "../../../components/shared/Notifications";
import { v4 as uuidv4 } from "uuid";
import ZoneService from "../../../services/ZoneService";

const CreateMonitorPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActiveSaveMonitor, setIsActiveSaveMonitor] = useState(false);
  const { openNotification, contextHolder } = useNotification()
  const [uniqueId, setUniqueId] = useState(uuidv4());
  const [activeElementModal, setActiveElementModal] = useState({
    id: 0,
    body: {
      isActive: false,
    },
  });

  useEffect(() => {
    form.setFieldsValue({ identifier: uniqueId });
  }, [uniqueId]);

  const onFinish = async () => {
    try {
      await form.validateFields();

      setIsActiveSaveMonitor(true);

    } catch (error) {

    }

  };


  const onSaveMonitor = async () => {
    form.setFields([
      {name:'url', value:'none'}
    ]);
    const values = await form.validateFields();

    values.report_id = parseInt(values.report_id);
    values.dashboardId = parseInt(values.dashboardId);

    // values.zones = 0;
    setLoading(true);
    ZoneService.createZone(values)
      .then(() => {
        openNotification('success', 'Se creo el monitor de manera correcta');
      }).catch((reason) => {
        openNotification('error', reason.message);
      }).finally(() => {
        setLoading(false);
        form.resetFields();
        setUniqueId(uuidv4());
        onCancelModal();
      });

  };

  const onCancelModal = () => {
    setActiveElementModal({ id: 0, body: { isActive: false } });
    setIsActiveSaveMonitor(false)
  };

  return (
    <>
      {contextHolder}
      <ActionMenuModal
        open={isActiveSaveMonitor}
        actionalId={activeElementModal.id}
        onConfirm={onSaveMonitor}
        title={'Confirmar'}
        onCancel={onCancelModal}
        width={"60%" as any}
        content={
          <div className="space-align-container" style={{

          }}>
            <div className="space-align-block">
              <Space align="center" style={{
                display: 'flex',
                width: '100%',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <h2>Crear vinculo para nuevo monitor</h2>
              </Space>
              <div style={{
                marginTop: 20,
                marginBottom: 20,
                height: '10%',
                width: '100%',
                backgroundColor: '#57341d',
                borderRadius: '5px',
                padding: 5

              }}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>

                  <Col className="gutter-row" span={6}>
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center', alignContent: 'center', alignItems: 'center'
                    }}>
                      <WarningFilled style={{ fontSize: 130 }} />
                    </div>
                  </Col>
                  <Col className="gutter-row" span={18}>
                    <div>
                      <p>
                        Está a punto de crear un código para insertar. Una vez publicado, cualquier persona en Internet con este vínculo podrá tener acceso al informe y a los datos de este. La información confidencial contenida en este monitor quedara expuesta a intenciones maliciosas.
                        <br /> <br />
                        Si sospecha que el vínculo está comprometido, puede regenerarlo desde el mantenedor de monitores.
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>

              <div>
                <p>
                  Antes de publicar este informe, asegúrese de que tiene el derecho para compartir los datos y las visualizaciones públicamente. No publique información confidencial o de propiedad, ni los datos personales de nadie. En caso de duda, revise las directivas de la organización antes de publicarlo.

                </p>
              </div>
            </div>
          </div>
        }
      />

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

        <Row gutter={24} className="create-user__container" justify={"center"}>
          <Col span={12} style={{
            justifyContent: 'center'
          }}>
            <Card bordered={false} style={{ padding: "16px", justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
              <MonitorForm form={form} />
              <Row gutter={24} className="create-user__container" justify={"center"} style={{
                marginTop: 100
              }}>
                <Button
                  type="primary"
                  block
                  style={{ width: "50%" }}
                  onClick={onFinish}
                  loading={loading}
                >
                  Crear nuevo Monitor
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </Layout>
    </>

  );
};

export default CreateMonitorPage;
