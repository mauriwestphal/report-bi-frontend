import {
  Col,
  Form,
  FormInstance,
  Input,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Spin,
  Switch,
} from "antd";
import { useEffect, useState } from "react";

import ZoneService from "../../../../services/ZoneService";

const { TextArea } = Input;

interface MonitorFormProps {
  form: FormInstance<any>;
  isEdit?: boolean;
}

interface PowerBi {
  value: number;
  label: string;
}

const MonitorForm = ({ form, isEdit = false }: MonitorFormProps) => {
  const [valueRadioPowerBI, setValueRadioPowerBI] = useState<number | null>(null);
  const [optionRadioPowerBI, setOptionRadioPowerBI] = useState<PowerBi[]>([]);
  const [loadingPowerBi, setLoadingPowerBi] = useState(true);

  useEffect(() => {
    ZoneService.listReportBI()
      .then(({ data }) => {
        setOptionRadioPowerBI(data);
      })
      .finally(() => {
        setLoadingPowerBi(false);
      });
  }, []);

  useEffect(() => {
    const reportId = form.getFieldValue("report_id");
    if (reportId) {
      setValueRadioPowerBI(parseInt(reportId, 10));
    }
  });

  const onChangePowerBI = (e: RadioChangeEvent) => {
    const value = parseInt(e.target.value, 10);
    setValueRadioPowerBI(value);
    form.setFieldsValue({ report_id: value });
  };

  return (
    <Form form={form} layout="vertical">
      <div style={{ marginBottom: 29, marginTop: 15 }}>
        <strong>Información del Monitor</strong>
      </div>

      <Row gutter={40}>
        <Col span={0}>
          <Form.Item name="id" />
        </Col>

        <Col span={12}>
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "El nombre es obligatorio" }]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="identifier" label="Identificador">
            <Input
              disabled
              style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="alias"
            label="Alias"
            rules={[{ required: true, message: "El alias es obligatorio" }]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: "La URL es obligatoria" }]}
          >
            <Input disabled={isEdit} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="description" label="Descripción">
            <TextArea rows={4} maxLength={550} showCount />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="isActive" label="Estado" valuePropName="checked">
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
          </Form.Item>
        </Col>
      </Row>

      <div style={{ marginBottom: 41, marginTop: 40 }}>
        <strong>¿Qué sección quieres visualizar en este monitor?</strong>
      </div>

      <Row gutter={40}>
        <Col span={24}>
          <Form.Item name="report_id" label="Reportes BI">
            <Spin tip="Cargando Reportes BI..." spinning={loadingPowerBi}>
              <Radio.Group onChange={onChangePowerBI} value={valueRadioPowerBI}>
                <Space direction="vertical">
                  {optionRadioPowerBI
                    .sort((a, b) => a.value - b.value)
                    .map((element: PowerBi) => (
                      <Radio key={element.value} value={Number(element.value)}>
                        {element.label}
                      </Radio>
                    ))}
                </Space>
              </Radio.Group>
            </Spin>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default MonitorForm;
