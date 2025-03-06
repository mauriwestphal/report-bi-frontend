import { CalendarOutlined, LeftCircleOutlined } from "@ant-design/icons";
import { ReactNode, useEffect, useState } from "react";
import { DateInterface } from "../../layout/interfaces";
import moment from "../../../utils/moment";
import { TopTitleStyle } from "./style";
import { Button } from "antd";
import { useRouter } from "next/router";
import { TopSearchProps } from "../interfaces/TopSearchInterface";
import TopSearch from "../TopSearch/index";

interface PropInterface {
  showDate?: boolean;
  comeBackConfig?: {
    route?: string;
    show?: boolean;
    text?: string;
  };
  title: {
    strong?: string;
    title?: string;
  };
  children?: ReactNode;
}

const TopTitle = ({
  showDate,
  comeBackConfig,
  title,
  search,
  action,
  children,
}: PropInterface & TopSearchProps) => {
  const router = useRouter();

  const [date, setDate] = useState<DateInterface>({
    day: "",
    numberDay: 0,
    month: "",
    year: "",
  });

  useEffect(() => {
    const today = moment();

    const day = today.format("dddd");
    const numberDay = today.date();
    const month = today.format("MMMM");
    const year = today.format("YYYY");
    setDate({
      day,
      numberDay,
      month,
      year,
    });
  }, []);

  const onComeBack = () => {
    router.back();
  };
  return (
    <TopTitleStyle>
      <div className="top-section">
        <h1>
          <strong>{title.strong}</strong> {title.title}
        </h1>

        {comeBackConfig && comeBackConfig.show && (
          <div className="come-back-container">
            <Button type="link" onClick={onComeBack}>
              {" "}
              <LeftCircleOutlined /> {comeBackConfig.text || "Volver al Inicio"}
            </Button>
          </div>
        )}
        {showDate && (
          <div className="date-section">
            <CalendarOutlined className="" />
            <span>{`${date.day} ${date.numberDay} de ${date.month}, ${date.year}`}</span>
          </div>
        )}
        
        {
          action && (
            <TopSearch action={action} search={search}/>
          )
        }
        {children}
      </div>
    </TopTitleStyle>
  );
};

export default TopTitle;
