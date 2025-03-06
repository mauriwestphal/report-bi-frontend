import { Layout, Badge, Space } from "antd";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { HeaderStyled } from "./styled";
import { lastUpdate } from "../../../services/Dashboard";
const { Header: AntdHeader } = Layout;

const HeaderDashboard = () => {
  const [getUpdate, setUpdate] = useState();
  const getLastUpdate = (): void => {
    try {
      lastUpdate().then(({ data }) => {
        setUpdate(data[0].SYNCSTARTDATETIME);
      })
    } catch (error) {

    }
  }

  useEffect(() => {
    getLastUpdate();
  }, [])

  return (
    <HeaderStyled>
      <AntdHeader>
        <div className="header_container__content">

          <div>
            <Image
              src="/shared/gama.png"
              alt="gama icon name"
              className="gama-icon"
              width={160}
              height={31}
              style={{
                borderRight: '1px solid white',
                paddingRight: '5px',
                marginRight: '10px'
              }}

                       />

            <span>Dashboard 360</span>
          </div>

          {/* MENU CRUD */}
          <div style={{
            textAlign: 'center'
          }}>
            <span style={{
              backgroundColor: 'rgba(255, 102, 0, 0.2)',
              border: '1px solid #FF6600',
              paddingTop: '10px',
              paddingBottom: '10px',
              paddingRight: '40px',
              paddingLeft: '40px',
              borderRadius: 10,
              textAlign: 'center',
            }}>
              {`Última actualización ${getUpdate} hrs`}
            </span>
          </div>

          <div className="action-menu-container">

          </div>
        </div>
      </AntdHeader>
    </HeaderStyled>
  );
};

export default HeaderDashboard;
