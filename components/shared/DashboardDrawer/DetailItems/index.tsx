import React from "react";
import { CarOutlined } from "@ant-design/icons";

import { Col, Divider, Row } from "antd";
import { ReactNode } from "react";
import { CarDetailsStyled } from "./style";

interface IDetailItemsProps {
  icon: ReactNode;
  title: string;
  description: string;

  items: {
    title: string;
    description: string;
  }[];
  itemsOperativo?: {
    title: string;
    description: string;
  }[];
  showDevider: boolean;
}

const DetailItems = ({
  icon,
  title,
  description,
  items,
  itemsOperativo, 
  showDevider
}: IDetailItemsProps) => {
  return (
    <CarDetailsStyled>
      <div className="detail-items__container">
        <div className="detail-items__header">
          <div className="car-icon">{icon}</div>

          <div className="car-text">
            <p className="car-patent">{title}</p>
            <p className="car-name">{description}</p>
          </div>
        </div>

        <div className="detail-items__details">
          <Row>
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <Col span={12} className="title">
                  {item.title}
                </Col>
                <Col span={12} className="description">
                  {item.description}
                </Col>
              </React.Fragment>
            ))}
            
            { showDevider &&
            <Col span={24} className="title" >
                          <h3 style={{marginTop: 40, marginBottom:40, fontWeight:'bold'}} >Información de operación</h3>

          </Col>
            
            }

            {itemsOperativo?.map((item, index) => (
              <React.Fragment key={index}>
                <Col span={12} className="title">
                  {item.title}
                </Col>
                <Col span={12} className="description">
                  {item.description}
                </Col>
              </React.Fragment>
            ))}
          </Row>
        </div>
      </div>
    </CarDetailsStyled>
  );
};

export default DetailItems;
