import { CarOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import BinnacleTimeline from "./BinnacleTimeline";
import DetailItems from "./DetailItems";
import { DashboardDrawerBodyStyle, DashboardDrawerStyled } from "./style";
import { getDetailVehicle } from "../../../services/Dashboard";
import Link from "next/link";

const closeDrawerButton = (onClick: any) => {
  return (
    <Button
      type="default"
      icon={<CloseOutlined />}
      onClick={onClick}
      className="round-icon-button"
    />
  );
};

enum DashboardDrawerOptions {
  BINNACLE = "binnacle",
  CAR = "car",
  CLIENT = "client",
  SPARE = "spare",
}

const onRenderDashboardContainer = (
  type: DashboardDrawerOptions,
  id: string,
  loading?: boolean,
  data?: any,
) => {
  switch (type) {
    case DashboardDrawerOptions.BINNACLE:
      return <BinnacleTimeline id={id} />;

    case DashboardDrawerOptions.CAR:
      return (
        <Spin spinning={loading} style={{ height: "100%" }}>
          <DetailItems
            icon={<CarOutlined />}
            title={data?.matricula || "Sin Matricula"}
            description={data?.descripcion_vehiculo || "Sin descripción"}
            items={[
              {
                title: "Marca",
                description: data?.marca || "Sin marca",
              },
              {
                title: "Linea de vehiculo",
                description: data?.linea_producto || "Sin linea de vehiculo",
              },
              {
                title: "Tracción",
                description: data?.diferencial || "Sin tracción",
              },
              {
                title: "Transmisión",
                description: data?.transmision || "Sin transmisión",
              },
              {
                title: "Combustible",
                description: data?.tipo_combustible || "Sin combustible",
              },
              {
                title: "Color",
                description: data?.color_exterior || "Sin color",
              },
              {
                title: "Año",
                description: data?.anio_modelo || "Sin año",
              },
              {
                title: "Fecha de adquisición",
                description: data?.fecha_adquisicion || "Sin fecha de adquisición",
              },
              {
                title: "km",
                description: data?.kilometraje.toLocaleString() || "Sin kilometraje",

              },
              {
                title: "VIN (nro_Chasis)",
                description: data?.nro_chasis || "Sin VIN",
              },
              {
                title: "nro_Motor",
                description: data?.nro_motor || "Sin nro_Motor",
              },
              {
                title: "Grupo vehículo",
                description: data?.grupo_vehiculo || "Sin Grupo vehículo",
              },





            ]}

            itemsOperativo={[
              {
                title: "Grupo flota",
                description: data?.grupo_flota || "Sin grupo flota",
              },
              {
                title: "Ciudad de operación",
                description: data?.ciudad_operacion || "Sin ciudad de operación",
              },
              {
                title: "Antigüedad del vehículo",
                description: data?.tiempo_adquisicion + " Meses" || "Sin Antigüedad del vehículo",
              }
            ]}
            showDevider={true}
          />
        </Spin>
      );

    case DashboardDrawerOptions.CLIENT:
      return (
        <DetailItems
          icon={<UserOutlined />}
          title={data?.nombre_cliente || "Sin nombre"}
          description={data?.rut || "Sin rut"}
          items={[
            {
              title: "Grupo de Flota",
              description: data?.grupo_flota_nom || "Sin grupo de flota",
            },
            {
              title: "Fecha Inicio Contrato",
              description: data?.fecha_inicio_contrato || "Sin fecha de inicio",
            },
            {
              title: "Kilometraje Contratado",
              description: data?.km_contratado || "Sin kilometraje contratado",
            },
            {
              title: "Tipo de Reemplazo",
              description: data?.tipo_reemplazo || "Sin tipo de reemplazo",
            }, {
              title: "Tiempo en Contrato",
              description: data?.tiempo_contrato + " Meses" || "Sin tiempo en contrato",
            },
            {
              title: "Segmento del Cliente",
              description: data?.seg_cliente || "Sin segmento del cliente",
            }, {
              title: "Supervisor de Contrato",
              description: data?.supervisor_contrato || "Sin supervisor de contrato",
            },
            {
              title: "Orden de Alquiler",
              description: data?.orden_alquiler || "Sin orden de alquiler",
            }, {
              title: "Tipo de Mantenimiento",
              description: data?.tipo_mantencion || "Sin tipo de mantenimiento",
            },
            {
              title: "Gasto Matención por Kilometro",
              description: data?.pesoxkm_contratado || "Sin gasto de mantenimiento por kilometro",
            }, {
              title: "Frecuencia Mantenimiento",
              description: data?.frecuencia_mant || "Sin frecuencia de mantenimiento",
            },
            {
              title: "Id de proyecto relacionado",
              description: data?.id_proyecto || "Sin id de proyecto relacionado",
            },
          ]}
          showDevider={false}
        />
      );
  }
};

const onRenderDrawerTitle = (type: DashboardDrawerOptions): React.ReactNode => {
  switch (type) {
    case DashboardDrawerOptions.BINNACLE:
      return (
        <>
          Bitácora de registros
        </>
      );

    case DashboardDrawerOptions.CAR:
      return (
        <>
          <strong>Información</strong> del auto
        </>
      );

    case DashboardDrawerOptions.CLIENT:
      return (
        <>
          <strong>Información</strong> del cliente
        </>
      );
  }
};

const DashboardDrawer = ({ id, show, setShow, caseId }: { id: string, show: boolean, setShow: () => void, caseId: string }) => {
  const [open, setOpen] = useState(show);
  const [loading, setLoading] = useState(false);
  const [detalleVehiculo, setDetalleVehiculo] = useState();
  useEffect(() => {
    if (caseId) {
      setLoading(true);
      getDetailVehicle(caseId).then(({ data }) => {
        setDetalleVehiculo(data[0]);
      }).finally(() => {
        setLoading(false);
      })

    }
  }, [caseId]);

  const [active, setActive] = useState<DashboardDrawerOptions>(
    DashboardDrawerOptions.BINNACLE
  );
  const handleChangeActive = (type: DashboardDrawerOptions) => {
    setActive(type);
  };
  return (
    <DashboardDrawerStyled>
      <Drawer
        title={onRenderDrawerTitle(active)}
        placement="right"
        onClose={setShow}
        open={show}
        extra={closeDrawerButton(setShow)}
        closable={false}
        rootClassName="dashboard-drawer"
        headerStyle={{ padding: "20px" }}
        bodyStyle={{ padding: "20px" }}
      >
        <DashboardDrawerBodyStyle>
          <div className="dashboard-drawer__header">
            <Space className="button-active-section" size={12}>
              <Button
                type={
                  active === DashboardDrawerOptions.BINNACLE
                    ? "primary"
                    : "default"
                }
                onClick={() =>
                  handleChangeActive(DashboardDrawerOptions.BINNACLE)
                }
              >
                Bitácora
              </Button>
              <Button
                type={
                  active === DashboardDrawerOptions.CAR ? "primary" : "default"
                }
                onClick={() => handleChangeActive(DashboardDrawerOptions.CAR)}
              >
                Detalle del auto
              </Button>
              <Button
                type={
                  active === DashboardDrawerOptions.CLIENT
                    ? "primary"
                    : "default"
                }
                onClick={() =>
                  handleChangeActive(DashboardDrawerOptions.CLIENT)
                }
              >
                Detalle de contrato
              </Button>

              <Link href="https://sdv.gamaleasing.cl/monitor/report/12">
                <a target="_blank">
                  <Button
                    type={
                      active === DashboardDrawerOptions.SPARE
                        ? "primary"
                        : "default"
                    }

                  >
                    Repuestos
                  </Button>
                </a>
              </Link>

            </Space>
          </div>
          <div className="dashboard-drawer__body">
            <div className="dashboard-drawer__container">
              {onRenderDashboardContainer(active, id, loading, detalleVehiculo)}
            </div>
          </div>

          {/* <div className="dashboard-drawer__footer">
            <Button type="primary" onClick={setShow}>Cerrar</Button>
          </div> */}
        </DashboardDrawerBodyStyle>
      </Drawer>
    </DashboardDrawerStyled>
  );
};

export default DashboardDrawer;
