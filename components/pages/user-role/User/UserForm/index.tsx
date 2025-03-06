import {
  Col,
  Form,
  FormInstance,
  Input,
  Row,
  Select,
  Spin,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import { clean, format, validate } from "rut.js";
import RoleService from "../../../../../services/RoleService";

import RoleInterface from "../../../../../shared/interfaces/Role.interface";
import ZoneInterface from "../../../../../shared/interfaces/Zones.interface";
import ZoneService from "../../../../../services/ZoneService";
import WorkshopsInterface from "../../../../../shared/interfaces/Workshops.interface";
import WorkshopServices from "../../../../../services/WorkshopService";
import ServicesInterface from "../../../../../shared/interfaces/Services.interface";
import SupervisorInterface from "../../../../../shared/interfaces/Supervisor.interface";
interface UserFormProps {
  form: FormInstance<any>;
}

interface Roles {
  data: RoleInterface[];
  loading: boolean;
}

interface Zones {
  data: ZoneInterface[];
  loading: boolean;
}

interface Workshops{
  data: WorkshopsInterface[],
  loading: boolean;
}

interface Services{
  data: ServicesInterface[],
  loading: boolean;
}

interface Supervisor{
  data: SupervisorInterface[],
  loading: boolean;
}


const UserForm = ({ form }: UserFormProps) => {
  const [roles, setRoles] = useState<Roles>({
    loading: false,
    data: [],
  });

  const [zones, setZones] = useState<Zones>({
    loading: false,
    data: []
  })

  const [workShops, setWorkShops] = useState<Workshops>({
    loading: false,
    data:[]
  })

  const [services, setServices] = useState<Services>({
    loading: false,
    data:[]
  })

  const [supervisor, setSupervisor] = useState<Supervisor>({
    loading: false,
    data:[]
  })

  useEffect(() => {
    // ROLES
    setRoles({ loading: true, data: [] });
    RoleService.list({}).then(({ data }) => {
      setRoles({ data: data as RoleInterface[], loading: false });
    });

    // // ZONES
    // setZones({loading: true, data: []});
    // ZoneService.listZones().then(({ data }) => {
    //   setZones({data: data as ZoneInterface[], loading: false});
    // })

    // TALLERES
    setWorkShops({loading: true, data:[]});
    WorkshopServices.listWorkShops().then(({data}) => {
      // ordenar por nombre de taller alfabeticamente
      data.sort((a: any,b: any) => {
        if(a.workshop < b.workshop) { return -1; }
        if(a.workshop > b.workshop) { return 1; }
        return 0;
      })
      setWorkShops({data: data as WorkshopsInterface[], loading: false});
    });

    // SERVICIOS
    setServices({loading: true, data:[]});
    WorkshopServices.listServices().then(({data}) => {
      let datos = data.map((element: ServicesInterface) => {
        return {
          ...element,
          group_id: element.group_id.trim()
        }
      });
      
      console.log("datos",datos);
      setServices({data: datos as ServicesInterface[], loading: false});
    });

    // SUPERVISOR DE CONTRATO
    setSupervisor({loading: true, data:[]});
    WorkshopServices.listSupervisorContrato().then(({data}) => {
      setSupervisor({data: data as SupervisorInterface[], loading: false});
    });
  }, []);

  return (
    <Form form={form} layout="vertical">
      <div style={{
        marginBottom:29,
        marginTop:15
      }}>
      <strong >Información del usuario</strong>
      </div>
      <Row gutter={40}>
     
        <Col span={0}>
          <Form.Item name="id"/>
        </Col>
        
        <Col span={12}>
          <Form.Item name="firstName" label="Nombre">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lastName" label="Apellido">
            <Input />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="rut"
            label="RUT"
            rules={[
              {
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  if (value && !validate(clean(value))) {
                    return Promise.reject(new Error("Rut no válido."));
                  }

                  return value
                    ? Promise.resolve(
                        form.setFieldsValue({
                          rut: format(value),
                        })
                      )
                    : Promise.reject(new Error("Rut no válido."));
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="email" label="Correo electrónico">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="isActive" valuePropName="checked" label="Activo">
            <Switch unCheckedChildren="No" checkedChildren="Sí" />
          </Form.Item>
        </Col>

        </Row>
        <div style={{
        marginBottom:41,
        marginTop:40
      }}>
      <strong>Asignaciones del perfil</strong>
      </div>
        <Row gutter={40}>

        <Col span={24}>
          <Form.Item name={["role", "id"]} label="Perfil">
            <Select placeholder="Seleccionar">
              {roles.data.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {/* <Col span={12}>
          <Form.Item name="zone_id" label="Zona">
            <Select placeholder="Seleccionar">
              {
                zones.data.map((zones) => (
                  <Select.Option key={zones.city_id} value={zones.city_id}>
                  { zones.city + ' - ' + zones.zone }
                </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="workshop_id" label="Talleres">
            <Select placeholder="Seleccionar">
              {
                workShops.data.map((workshops) => (
                  <Select.Option key={workshops.locationid} value={workshops.locationid}>
                  { workshops.workshop }
                </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="service_id" label="Servicios">
            <Select placeholder="Seleccionar">
              {
                services.data.map((services) => (
                  <Select.Option key={services.group_id.trim()} value={services.group_id.trim()}>
                  { services.description }
                </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="contract_supervisor_id" label="Supervisor de Contrato">
            <Select placeholder="Seleccionar">
              {
                supervisor.data.map((supervisor) => (
                  <Select.Option key={supervisor.PERSONNELNUMBER} value={supervisor.PERSONNELNUMBER}>
                  { supervisor.NAME }
                </Select.Option>
                ))
              }
            </Select>
          </Form.Item>
        </Col> */}
      </Row>
    </Form>
  );
};

export default UserForm;
