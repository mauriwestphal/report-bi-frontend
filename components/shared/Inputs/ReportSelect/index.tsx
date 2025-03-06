import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Row, Select, Space } from "antd";

interface IReportSelectProps {
  name: string;
}

const ReportSelect = ({ name }: IReportSelectProps) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => (
        <Row gutter={40} justify="start">
          {fields.map(({ key, name, ...restField }) => (
            <>
              <Col span={12}>
                <Form.Item
                  {...restField}
                  name={[name, "reportId"]}
                  rules={[{ required: true, message: "Campo requerido" }]}
                  label="Reportes"
                >
                  <Select />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  {...restField}
                  name={[name, "reportPages"]}
                  rules={[{ required: true, message: "Campo requerido" }]}
                  label="Páginas"
                >
                  <Select />
                </Form.Item>
              </Col>
              <Col span={4} style={{ alignSelf: "center" }}>
                <Button
                  type="default"
                  icon={<DeleteOutlined />}
                  className="round-icon-button"
                  onClick={() => remove(name)}
                />
              </Col>
            </>
          ))}
          <Col>
            <Form.Item>
              <Button
                type="link"
                onClick={() => add()}
                block
                icon={<PlusCircleOutlined />}
              >
                Agregar nuevo reporte
              </Button>
            </Form.Item>
          </Col>
        </Row>
      )}
    </Form.List>
  );
};

export default ReportSelect;
