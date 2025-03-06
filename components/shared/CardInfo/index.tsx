import { Button, Card, Space } from 'antd';
import { CardInfoStyle } from "./styled";
import { CardInfoProps } from "../interfaces/CardInfoInterface";
import { RightCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useState } from 'react';

const CardInfo = ({
  bordered,
  title,
  icon,
  body,
  footerConfig,
  url,
  icono
}: CardInfoProps) => {
  const router = useRouter();
  const [showIcon, setShowIcon] = useState(icono || true)
  const handleClickCard = (route: string): void => {
    router.push(url);
  };
  return (
    <CardInfoStyle>
      <div className="card-info-container">
        <Card bordered={bordered}>
          <div className="card-info-container__content">
            <div className="card-info-container__title">
              { showIcon && <div className="icon-framework">{icon}</div>}
              <h2>
                <strong>{title}</strong>
              </h2>
            </div>
            <div className="card-info-container__body" style={{ height: "100px", overflow: "hidden" }}>{body}</div>
          </div>
            {/* <hr color="black"/> */}
          <div className="card-info-container__footer" style={footerConfig}>
            <Space  style={{
              flex: 1, alignContent:'center', justifyContent:'center',
              width:'100%', textAlign:'center'
            }}>
            <Button onClick={() => handleClickCard(url)} >
              <span>
                {" "}
                Ver información <RightCircleOutlined className='icon-button'/>{" "}
              </span>
            </Button>
            </Space>
           
          </div>
        </Card>
      </div>
    </CardInfoStyle>
  );
};

export default CardInfo;
