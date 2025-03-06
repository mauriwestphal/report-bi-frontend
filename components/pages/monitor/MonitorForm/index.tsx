import {
  Col,
  Form,
  FormInstance,
  Input,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Space,
  Spin,
  Switch,
} from "antd";
import { useEffect, useState } from "react";


import ZoneService from "../../../../services/ZoneService";

const { TextArea } = Input;

interface MonitorFormProps {
  form: FormInstance<any>;
}
interface Zones {
  label: string;
  value: number
}

interface PowerBi {
  value: number;
  label: string;
}

interface ScreenDashboard {
  id: number;
  nameScreen: string;
  isActive: boolean;
}

interface RadioGroupProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  name: string;
}

interface MyComponentState {
  valueDashBoard: number | undefined;
  valuePowerBI: number | undefined;
}

const mapDataToOptions = (data: any[]): Zones[] => (
  data.map((element) => ({
    label: `${element.city} - ${element.zone}`,
    value: element.city_id
  }))
);


const MonitorForm = ({ form }: MonitorFormProps) => {
  const values = form.getFieldsValue();
  const id = values.id;
  const [valueRadioDashboard, setValueRadioDashboard] = useState<number | null>(null);
  const [valueRadioPowerBI, setValueRadioPowerBI] = useState<number | null>(null);
  const [optionZones, setOptionZones] = useState<Zones[]>([]);
  const [optionRadioPowerBI, setOptionRadioPowerBI] = useState<PowerBi[]>([]);
  const [optionScreenDashBoard, setOptionScreenDashBoard] = useState<ScreenDashboard[]>([]);
  const [loadingPowerBi, setLoadingPowerBi] = useState(true);
  const [loadingScreenDashboard, setLoadingScreenDashboard] = useState(true);


  useEffect(() => {
    const {  listReportBI, listScreenDashboard } = ZoneService;
 
    // listZones().then(({ data }) => {
    //   setOptionZones(mapDataToOptions(data));
    // })

    listReportBI().then(({ data }) => {
      setOptionRadioPowerBI(data);
    }).finally(()=>{
      setLoadingPowerBi(false);
    });

    listScreenDashboard().then(({ data }) => {
      setOptionScreenDashBoard(data);
    }).finally(()=>{
      setLoadingScreenDashboard(false);
    });

  }, []);


  useEffect(() => {
    if (values?.dashboardId) {
      setValueRadioDashboard(parseInt(values?.dashboardId, 10));
    }
    if (values?.report_id) {
      setValueRadioPowerBI(parseInt(values?.report_id, 10));
    }
  }, [values?.dashboardId, values?.report_id]);

  // const onChangeDashboard = (e: RadioChangeEvent) => {
  //   // form.setFieldsValue({ 
  //   //   report_id:  0
  //   // })

  //   //  setValueRadioPowerBI(0);
  //   //  setValueRadioDashboard(Number(e.target.value));

  //   const value = parseInt(e.target.value, 10);
  //   setValueRadioDashboard(value);
  //   form.setFieldsValue({
  //     dashboardId: value,
  //     report_id: 0
  //   });

  //   if (value !== null) {
  //     setValueRadioPowerBI(null);
  //   }

  //    console.log("values dashboard",values)
  // };

  const onChangePowerBI = (e: RadioChangeEvent) => {


    const value = parseInt(e.target.value, 10);
    setValueRadioPowerBI(value);
    form.setFieldsValue({
      report_id: value,
      // dashboardId: 0
    });

    if (value !== null) {
      setValueRadioDashboard(null);
    }
    
    console.log("values powerbi",values)
  };


  const disabledForm = (id:any) => {
    return id ? true : false;
  }
  return (
    <Form form={form} layout="vertical">
      <div
        style={{
          marginBottom: 29,
          marginTop: 15,
        }}
      >
        <strong>Información del Monitor</strong>
      </div>
      <Row gutter={40}>
        {/* <Col span={0}>
          <Form.Item name="id" />
        </Col> */}
     <Col span={0}>
          <Form.Item name="id"/>
        </Col>
        <Col span={12}>
          <Form.Item name="name" label="Nombre" 
          >
            <Input disabled={disabledForm(id)}/>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="identifier" label="Identificador">
            <Input disabled style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }} />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="alias" label="Alias">
            <Input disabled={disabledForm(id)} />
          </Form.Item>
        </Col>

        {/* <Col span={12}>
          <Form.Item name="zones" label="Zonas">
            <Select placeholder="Seleccionar"
              options={optionZones}
              disabled={disabledForm(id)}
            />
          </Form.Item>
        </Col> */}

        <Col span={24}>
          <Form.Item name="description" label="Descripcion">
            <TextArea rows={4} maxLength={500} disabled={disabledForm(id)}/>
          </Form.Item>
        </Col>
      </Row>
      <div
        style={{
          marginBottom: 41,
          marginTop: 40,
        }}
      >
        <strong>¿Qué sección quieres visualizar en este monitor?</strong>
      </div>
      <Row gutter={40}>
        {/* <Col span={12}>
          <Form.Item name='dashboardId' label="Dashboard">
            <Spin tip="Cargando Dashboard..." spinning={loadingScreenDashboard}>
              <Radio.Group onChange={onChangeDashboard} value={valueRadioDashboard}>
                <Space direction="vertical">
                  {optionScreenDashBoard.sort((a, b) => a.id - b.id).map((element: ScreenDashboard) => {
                    return <Radio key={element.id} value={Number(element.id)}>{element.nameScreen}</Radio>
                  })}
                </Space>
              </Radio.Group>
            </Spin>
          </Form.Item>
        </Col> */}
        <Col span={24}>
          <Form.Item name='report_id' label="Reportes BI">
            <Spin tip="Cargando Reportes BI..." spinning={loadingPowerBi} >
              <Radio.Group onChange={onChangePowerBI} value={valueRadioPowerBI}>
                <Space direction='vertical'>
                  {optionRadioPowerBI.sort((a, b) => a.value - b.value).map((element: any) => {
                    return <Radio key={element.value} value={Number(element.value)}>{element.label}</Radio>
                  })}
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
