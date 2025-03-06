import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Space,
  Spin,
  Timeline,
  message as antMessage,
} from "antd";
import { BinnacleInterface, UserInterface, LogsBinnacleInterface } from "../../../layout/interfaces";
import { BinnacleTimelineStyled } from "./style";
import {
  CheckCircleOutlined,
  CommentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import moment from "../../../../utils/moment";
import ActionMenuModal from "../../ActionMenuModal";
import BinnacleService from "../../../../services/BinnacleService";

const { Item } = Timeline;

interface IBinnacleTimelineItem extends Omit<LogsBinnacleInterface, "user"> {
  user?: Pick<UserInterface, "id" | "firstName" | "lastName">;
}

const systemBinnacleItem = (item: IBinnacleTimelineItem) => {
  return (
    <Item
      dot={<CheckCircleOutlined />}
      className="system-binnacle-item"
      key={item.id}
    >
      <div>
        <p className="title">Orden de servicio {item.caseid}</p>
        <p className="title">Creador por: {item.createdby1}</p>
        <p>{`Fecha creación OS: ${moment(item.schedfromdate)
          .format("dddd")
          .replace(/^\w/, (c) => c.toUpperCase())} ${moment(
          item.schedfromdate
        ).format("DD/MM/YYYY")}`}</p>
        <br />

        <span className="createdAt">{`Fecha de registro: ${moment(item.createddatetime1)
          .format("dddd")
          .replace(/^\w/, (c) => c.toUpperCase())} ${moment(
          item.createddatetime1
        ).format("DD/MM/YYYY")} - ${moment(item.createddatetime1).format(
          "HH:mm"
        )} hrs.`}</span>
        <p className="title">Estado: {item.estado} </p>
        <p className="title">Sub estado: {item.substatusto} </p>
        <br />
        <p className="title"> Servicio: {item.tipo_servicio} / {item.grupo_servicio}</p>
        <span>Ubicación: {`${item.workshop} / ${item.city} / ${item.region} `}</span>

        <br />        <br />

        <p className="title">Observaciones:</p>
        <span>
        {item && (item.cause || item.solution || item.description)
          ? `${item.cause ? item.cause + ', ' : ''}${item.solution ? item.solution + ', ' : ''}${item.description}`
          : 'Sin observaciones'}
        </span>
      </div>
    </Item>
  );
};
const noteBinnacleItem = (item: IBinnacleTimelineItem) => {
  return (
    <Item
      dot={<CommentOutlined />}
      className="note-binnacle-item"
      key={item.id}
    >
      <div>
        <p className="title">{`Nota: ${item.createdby1}.`}</p>
        <span className="createdAt">{`${moment(item.createddatetime1)
          .format("dddd")
          .replace(/^\w/, (c) => c.toUpperCase())} ${moment(
          item.createddatetime1
        ).format("DD/MM/YYYY")} - ${moment(item.createddatetime1).format(
          "HH:mm"
        )} hrs.`}</span>

        <p className="message">{item.description}</p>
      </div>
    </Item>
  );
};

const BinnacleTimeline = ({ id }: { id: string }) => {
  const [data, setData] = useState<IBinnacleTimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfimModal] = useState(false);
  const [noteMessage, setNoteMessage] = useState("");

  const handleSendMessage = () => {
    setConfimModal(true);
  };

  const handleConfirmSendMessage = async (message: string) => {
    try {
      await BinnacleService.create(id, message);
      setConfimModal(false);
      await handleFetchBinnacleItems();
    } catch (e) {
      antMessage.error("Ocurrio un error al intentar crear el mensaje");
    } finally {
      setConfimModal(false);
    }
  };

  const handleCancelSendMessage = () => {
    setConfimModal(false);
  };

  const handleFetchBinnacleItems = async () => {
    try {
      setLoading(true);
      const { data: binnacleItems } = await BinnacleService.list(id);
      setData(() => binnacleItems);
      setNoteMessage("");
    } catch (e) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchBinnacleItems();
  }, [id]);
  return (
    <>
      <ActionMenuModal
        open={confirmModal}
        actionalId={0}
        onConfirm={() => handleConfirmSendMessage(noteMessage)}
        onCancel={handleCancelSendMessage}
        width={380}
        content={
          <>
            <p>¿Estás seguro de enviar esta nota?</p>
          </>
        }
      />
      <BinnacleTimelineStyled style={{ height: "100%" }}>
        <div className="binnacle-timeline__container">
          <Spin spinning={loading} style={{ height: "100%" }}>
            <Timeline className="binnacle-timeline">
              {data.map((item, index) =>
                item.type === "USER_MESSAGE"
                  ? noteBinnacleItem({ ...item, id: index.toString() })
                  : systemBinnacleItem({ ...item, id: index.toString() })
              )}
            </Timeline>

            <Space className="submit-binnacle-note" size={15}>
              <Input
                placeholder="Agregar una nota..."
                onChange={(event) => setNoteMessage(event.target.value)}
                value={noteMessage}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
              />{" "}
            </Space>
          </Spin>
        </div>
      </BinnacleTimelineStyled>
    </>
  );
};

export default BinnacleTimeline;
