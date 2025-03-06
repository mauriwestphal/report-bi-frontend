import { Col, Form, FormInstance, Input, Row, Switch, Select } from "antd";
import { useEffect, useState } from "react";
import PermissionService, {
  IPermissionDataNode,
} from "../../../../../services/PermissionService";
import ReportSelect from "../../../../shared/Inputs/ReportSelect";
import TreeForm from "../../../../shared/Inputs/TreeForm";
import { IReportPage } from '../../../../layout/interfaces/index';

interface UserFormProps {
  form: FormInstance<any>;
}


const extractNumericPart = (str: string): number => {
  const numericPart = str.split(".")[0];

  if (!isNaN(parseInt(numericPart))) {
      return parseInt(numericPart);
  } else {
      return NaN;
  }
}


const RoleForm = ({ form }: UserFormProps) => {
  const [permissions, setPermissions] = useState<IPermissionDataNode[]>([]);
  const [reportPages, setReportPages] = useState<IReportPage[]>([]);
  const [report, setReport] = useState<IReportPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const selectedPermissions: [] = Form.useWatch("permissions", form);
  const [selectedItems, setSelectedItems] = useState<IReportPage[]>([]);
  const [selectedReport, setSelectedReport] = useState<IReportPage[]>([]);
  
  const filteredOptions = reportPages.filter(
    (item) => !selectedItems.find((selectedItem) => selectedItem.value === item.value)
  );

  const handleChange = (value: IReportPage[], options: IReportPage | IReportPage[]) => {
    setSelectedItems(value);
  };

  const handleChangeReport = (value: IReportPage[], options: IReportPage | IReportPage[]) => {
    console.log(value);
    setSelectedReport(value);
  }


  useEffect(() => {
    setLoading(true);
    PermissionService.list()
      .then(({ data }) => {
        const dataNode = PermissionService.formatToDataNode(data);
        setPermissions(dataNode);
      })
      .finally(() => {
        setLoading(false);
      });

    PermissionService.listReportPage()
      .then(({ data }) => {
        setReportPages(data);
      })
      .finally(() => {
        setLoading(false);
      });

      PermissionService.listReport()
      .then(({ data }) => {
        setReport(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  useEffect(() => {
    if (selectedPermissions) {
      const show = selectedPermissions.some((id: number) =>
        permissions.some(
          (permission) =>
            permission.key === "REPORTS" &&
            permission.children?.find((children) => children.key === id)
        )
      );
      setShowReports(show);
    }
  }, [selectedPermissions]);

  return (
    <Form form={form} layout="vertical">
      <div
        style={{
          marginBottom: 29,
          marginTop: 15,
        }}
      >
        <strong>Asignaciones para nuevo rol</strong>
      </div>
      <Row gutter={40}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="Nombre del rol"
            rules={[
              {
                required: true,
                message: "Campo requerido",
              },
            ]}
          >
            <Input />
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
                  placeholder="Agregar reportes"
                  value={selectedReport}
                  onChange={handleChangeReport}
                  style={{ width: '100%' }}
                  options={report}
                  loading={loading}
                />
            </Form.Item>
            <Form.Item name="reportPages" label="Paginas de reportes">
              <Select 
                mode="multiple"
                placeholder="Agregar reportes"
                value={selectedItems}
                onChange={handleChange}
                style={{ width: '100%' }}
                options={filteredOptions.sort(
                  (a: any, b: any) => {
                      const aNumber = extractNumericPart(a.label);
                      const bNumber = extractNumericPart(b.label);
                      return aNumber - bNumber || a.label.localeCompare(b.label);
                  }
              )}
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
