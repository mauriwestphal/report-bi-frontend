import { CheckOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import DashboardProgressBar from "../DashboardProgressBar";
import { DetailOrderCardStyle } from "./style";
import popoverInterface from "../../../shared/interfaces/Popover.iterface";
import moment from "moment";
const DetailOrderCard = ({popover}:{popover:popoverInterface | undefined}) => {


  return (
    <DetailOrderCardStyle>
      <Card className="detail-order-card__container" bordered={false}>
        {/* <DashboardProgressBar
          title="Estado Actual"
          startText="Enero S4"
          progressBar={{
            label: "Pruebas",
            footerText: "5 Días - 10 hrs",
            progress: 70,
            color: "red",
          }}
          icon={<CheckOutlined />}
          iconText="Al dia"
        /> */}

        <div className="detail-order-card__information">
          <Row gutter={12}>
            <Col span={12} className="title">
              Orden servicio
            </Col>
            <Col span={12}>{popover?.CASEID}</Col>
            <Col span={12} className="title">
              Fecha creacion
            </Col>
            <Col span={12}>{
              `${moment(popover?.GMCREATEDDATETIME)
                .format("dddd")
                .replace(/^\w/, (c) => c.toUpperCase())} ${moment(
                popover?.GMCREATEDDATETIME
              ).format("DD/MM/YYYY")}`
            }</Col>
            <Col span={12} className="title">
              Taller
            </Col>
            <Col span={12}>{
              popover?.workshop
            }</Col>
            <Col span={12} className="title">
              Tipo servicio
            </Col>
            <Col span={12}>{
              popover?.tipo_servicio
            }</Col>
            <Col span={12} className="title">
              Estado
            </Col>
            <Col span={12}>{
              popover?.estado
            }</Col>

            <Col span={12} className="title">
              Sub estado
            </Col>
            <Col span={12}>{
              popover?.SUBSTATUSTO
            }</Col>
            <Col span={12} className="title">
              Fecha del log
            </Col>
            <Col span={12}>{
              `${moment(popover?.CREATEDDATETIME2)
                .format("dddd")
                .replace(/^\w/, (c) => c.toUpperCase())} ${moment(
                popover?.CREATEDDATETIME2
              ).format("DD/MM/YYYY")} - ${moment(popover?.CREATEDDATETIME2).format(
                "HH:mm"
              )} hrs.`
            }</Col>
            <Col span={12} className="title">
              Termino esperado del log:
            </Col>
            <Col span={12}>{
              popover?.dateEnd ? `${moment(popover?.dateEnd)
                .format("dddd")
                .replace(/^\w/, (c) => c.toUpperCase())} ${moment(
                popover?.dateEnd
              ).format("DD/MM/YYYY")} - ${moment(popover?.dateEnd).format(
                "HH:mm"
              )} hrs.` : 'Sin fecha de termino'
            }</Col>
            <Col span={12} className="title">
              Espera repuestos
            </Col>
            <Col span={12}>
              {popover?.tiene_repuesto ? 'SI' : 'NO'}
            </Col>
            <Col span={12} className="title">
              Cantidad de repuestos
            </Col>
            <Col span={12}>
              {popover?.recuento}
            </Col>
            <Col span={12} className="title">
              Observaciones
            </Col>
            <Col span={12}>{
              popover && (popover.cause || popover.solution || popover.description) ? `${popover.cause ? popover.cause + ', ' : ''}${popover.solution ? popover.solution + ', ' : ''}${popover.description}` : 'Sin observaciones'
            }</Col>
          </Row>
        </div>
      </Card>
    </DetailOrderCardStyle>
  );
};

export default DetailOrderCard;
