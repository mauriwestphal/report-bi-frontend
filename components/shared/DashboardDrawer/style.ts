import styled from "styled-components";

export const DashboardDrawerStyled = styled.div`
  .dashboard-drawer {
    .ant-drawer-content-wrapper {
      //   width: 670px !important;

      width: 700px;
      height: 100px;
    }
    
  }
`;

export const DashboardDrawerBodyStyle = styled.div`
  .dashboard-drawer__header {
    margin-bottom: 40px;

    .button-active-section {
      .ant-btn {
        padding: 9px 12px;
        min-height: 39px;
        span {
          font-weight: 700;
          font-size: 16px;
          line-height: 18px;
        }
      }
      .ant-btn-primary {
        span {
          color: white !important;
        }
      }
      .ant-btn-default {
        border-color: ${({ theme }) => theme.colorPrimary};
        span {
          color: ${({ theme }) => theme.colorPrimary} !important;
        }
      }
    }
  }

  .dashboard-drawer__footer {
    text-align: center;
    margin-top: 70px;
    .ant-btn-primary {
      width: 50%;
      border-radius: 36px;
      span {
        color: white;
      }
    }
  }
  .dashboard-drawer__container {
    height: calc(100vh - 303px);
  }
`;
