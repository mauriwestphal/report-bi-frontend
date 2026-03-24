import { WarningFilled } from "@ant-design/icons";
import { Button, Card, Col, Form, Row, Space } from "antd";
import { useEffect, useState } from "react";

import Layout from "../../../components/layout";
import MonitorForm from "../../../components/pages/monitor/MonitorForm";
import ActionMenuModal from "../../../components/shared/ActionMenuModal";
import TopTitle from "../../../components/shared/TopTitle";
import { useNotification } from "../../../components/shared/Notifications";
import { v4 as uuidv4 } from "uuid";
import MonitorService from "../../../services/MonitorService/monitor";

const CreateMonitorPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isActiveSaveMonitor, setIsActiveSaveMonitor] = useState(false);
  const { openNotification, contextHolder } = useNotification();
  const [uniqueId, setUniqueId] = useState(uuidv4());

  useEffect(() => {
    form.setFieldsValue({ identifier: uniqueId, isActive: true });
  }, [uniqueId]);

  const onFinish = async () => {
    try {
      await form.validateFields();
      setIsActiveSaveMonitor(true);
    } catch {
      // validation errors are shown inline
    }
  };

  const onSaveMonitor = async () => {
    const values = await form.validateFields();

    const payload = {
      ...values,
      report_id: values.report_id ? parseInt(values.report_id) : undefined,
      dashboardId: values.dashboardId ? parseInt(values.dashboardId) : undefined,
    };

    setLoading(true);
    MonitorService.createMonitor(payload)
      .then(() => {
        openNotification("success", "Monitor creado correctamente");
        form.resetFields();
        setUniqueId(uuidv4());
        onCancelModal();
      })
      .catch((reason: any) => {
        if (reason?.status === 409) {
          openNotification(
            "error",
            "Ya existe un monitor con ese nombre, alias o URL. Por favor verifica los datos."
          );
        } else {
          openNotification("error", reason?.message || "Error al crear el monitor");
        }
        onCancelModal();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCancelModal = () => {
    setIsActiveSaveMonitor(false);
  };

  return (
    <>
      {contextHolder}
      <ActionMenuModal
        open={isActiveSaveMonitor}
        actionalId={0}
        onConfirm={onSaveMonitor}
        title="Confirmar"
        onCancel={onCancelModal}
        width={"60%" as any}
        content={
          <div className="space-align-container">
            <div className="space-align-block">
              <Space
                align="center"
                style={{
                  display: "flex",
                  width: "100%",
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h2>Crear vínculo para nuevo monitor</h2>
              </Space>
              <div
                style={{
                  marginTop: 20,
                  marginBottom: 20,
                  width: "100%",
                  backgroundColor: "#57341d",
                  borderRadius: "5px",
                  padding: 5,
                }}
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col span={6}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <WarningFilled style={{ fontSize: 130 }} />
                    </div>
                  </Col>
                  <Col span={18}>
                    <p>
                      Está a punto de crear un código para insertar. Una vez
                      publicado, cualquier persona en Internet con este vínculo
                      podrá tener acceso al informe y a los datos de este. La
                      información confidencial contenida en este monitor quedará
                      expuesta a intenciones maliciosas.
                      <br />
                      <br />
                      Si sospecha que el vínculo está comprometido, puede
                      regenerarlo desde el mantenedor de monitores.
                    </p>
                  </Col>
                </Row>
              </div>
              <p>
                Antes de publicar este informe, asegúrese de que tiene el
                derecho para compartir los datos y las visualizaciones
                públicamente. No publique información confidencial o de
                propiedad, ni los datos personales de nadie. En caso de duda,
                revise las directivas de la organización antes de publicarlo.
              </p>
            </div>
          </div>
        }
      />

      <Layout>
        <TopTitle
          comeBackConfig={{
            route: "/monitor",
            show: true,
            text: "Volver a Monitor",
          }}
          title={{
            title: "Gestión de Monitores / Crear nuevo Monitor",
          }}
        />

        <Row gutter={24} className="create-user__container" justify="center">
          <Col span={12}>
            <Card
              bordered={false}
              style={{ padding: "16px" }}
            >
              <MonitorForm form={form} />
              <Row
                gutter={24}
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
