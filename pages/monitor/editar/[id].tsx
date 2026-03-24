import { Button, Card, Col, Form, Row, Spin } from "antd";
import { useEffect, useState } from "react";

import Layout from "../../../components/layout";
import MonitorForm from "../../../components/pages/monitor/MonitorForm";
import TopTitle from "../../../components/shared/TopTitle";
import { useNotification } from "../../../components/shared/Notifications";
import { useRouter } from "next/router";
import MonitorService from "../../../services/MonitorService/monitor";

const UpdateMonitorPage = () => {
  const [form] = Form.useForm();
  const monitorId = Form.useWatch("id", form);
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useNotification();

  useEffect(() => {
    if (query.id) {
      MonitorService.getOneMonitor(Number(query.id)).then(({ data }) => {
        form.setFieldsValue({ ...data });
        form.setFields([
          {
            name: "dashboardId",
            value: isNaN(Number(data.dashboard?.id)) ? 0 : Number(data.dashboard?.id),
          },
          {
            name: "report_id",
            value: isNaN(Number(data.report?.id)) ? 0 : Number(data.report?.id),
          },
        ]);
      });
    }
  }, [query]);

  const onFinish = async () => {
    const values = await form.validateFields();

    const payload = {
      ...values,
      report_id: values.report_id ? parseInt(values.report_id) : undefined,
      dashboardId: values.dashboardId ? parseInt(values.dashboardId) : undefined,
    };

    setLoading(true);
    MonitorService.updateMonitor(payload)
      .then(() => {
        openNotification("success", "Monitor editado correctamente");
      })
      .catch((reason: any) => {
        if (reason?.status === 409) {
          openNotification(
            "error",
            "Ya existe un monitor con ese nombre, alias o URL."
          );
        } else {
          openNotification("error", reason?.message || "Error al editar el monitor");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {contextHolder}

      <Layout>
        <TopTitle
          comeBackConfig={{
            route: "/monitor",
            show: true,
            text: "Volver a Monitor",
          }}
          title={{
            title: "Gestión de Monitores / Editar Monitor",
          }}
        />

        <Row gutter={24} className="update-monitor__container" justify="center">
          <Col span={12}>
            <Spin spinning={!monitorId}>
              <Card bordered={false} style={{ padding: "16px" }}>
                <MonitorForm form={form} isEdit />
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
