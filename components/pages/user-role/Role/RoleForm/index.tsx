import { Col, Form, FormInstance, Input, Row, Switch, Select } from "antd";
import { useEffect, useRef, useState } from "react";
import PermissionService, {
  IPermissionDataNode,
} from "../../../../../services/PermissionService";
import TreeForm from "../../../../shared/Inputs/TreeForm";
import { IReportPage } from "../../../../layout/interfaces/index";
import { PERMISSION_TYPE } from "../../../../../shared/enum/permission.enum";

interface UserFormProps {
  form: FormInstance<any>;
}

const extractNumericPart = (str: string): number => {
  const numericPart = str.split(".")[0];
  if (!isNaN(parseInt(numericPart))) {
    return parseInt(numericPart);
  }
  return NaN;
};

const RoleForm = ({ form }: UserFormProps) => {
  const [permissions, setPermissions] = useState<IPermissionDataNode[]>([]);
  const [reportPages, setReportPages] = useState<IReportPage[]>([]);
  const [report, setReport] = useState<IReportPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [canViewReportsId, setCanViewReportsId] = useState<number | null>(null);
  const selectedPermissions: number[] = Form.useWatch("permissions", form);
  const prevShowReports = useRef(false);

  const filteredOptions = reportPages.filter(
    (item) =>
      !(form.getFieldValue("reportPages") || []).includes(item.value)
  );

  useEffect(() => {
    setLoading(true);
    PermissionService.list()
      .then(({ data }) => {
        const allPerms = data.flatMap((g) => g.permissions);
        const canViewReports = allPerms.find(
          (p) => p.keyName === PERMISSION_TYPE.CAN_VIEW_REPORTS
        );
        setCanViewReportsId(canViewReports?.id ?? null);

        const dataNode = PermissionService.formatToDataNode(data);
        setPermissions(dataNode);
      })
      .finally(() => setLoading(false));

    PermissionService.listReportPage()
      .then(({ data }) => setReportPages(data))
      .finally(() => setLoading(false));

    PermissionService.listReport()
      .then(({ data }) => setReport(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (canViewReportsId === null) return;

    const hasViewReports =
      Array.isArray(selectedPermissions) &&
      selectedPermissions.includes(canViewReportsId);

    setShowReports((prev) => {
      if (prev && !hasViewReports) {
        form.setFieldValue("reportPages", []);
      }
      prevShowReports.current = hasViewReports;
      return hasViewReports;
    });
  }, [selectedPermissions, canViewReportsId]);

  return (
    <Form form={form} layout="vertical">
      <div style={{ marginBottom: 29, marginTop: 15 }}>
        <strong>Asignaciones para nuevo rol</strong>
      </div>
      <Row gutter={40}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Nombre del rol"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="keyName"
            label="Identificador (keyName)"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <Input placeholder="Ej: ADMIN, VIEWER" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item name="isActive" valuePropName="checked" label="Activo">
            <Switch unCheckedChildren="No" checkedChildren="Sí" />
          </Form.Item>
        </Col>

        <Col span={0}>
          <Form.Item name="id" />
        </Col>

        <Col span={12}>
          <TreeForm
            form={form}
            name="permissions"
            label="Seleccione la información que podrá realizar el perfil:"
            permissions={permissions}
            loading={loading}
          />
        </Col>

        {showReports && (
          <Col span={24}>
            <Form.Item name="report" label="Reportes">
              <Select
                mode="multiple"
                placeholder="Filtrar por reporte"
                style={{ width: "100%" }}
                options={report}
                loading={loading}
              />
            </Form.Item>
            <Form.Item name="reportPages" label="Páginas de reportes">
              <Select
                mode="multiple"
                placeholder="Agregar páginas de reporte"
                style={{ width: "100%" }}
                options={filteredOptions.sort((a: any, b: any) => {
                  const aNumber = extractNumericPart(a.label);
                  const bNumber = extractNumericPart(b.label);
                  return aNumber - bNumber || a.label.localeCompare(b.label);
                })}
                loading={loading}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default RoleForm;
