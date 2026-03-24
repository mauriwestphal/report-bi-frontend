import { Layout, Badge, Space } from "antd";
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.5px', color: '#fff', borderRight: '1px solid white', paddingRight: '10px' }}>
              Bi<span style={{ color: '#3b82f6' }}>Pro</span>
            </span>
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
