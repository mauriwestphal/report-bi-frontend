import styled from "styled-components";

export const DetailRoleDrawerStyled = styled.div`
  .detail-role-drawer {
    .ant-drawer-content-wrapper {
      width: 670px !important;
      height: 100px;
    }
  }
`;

export const DetailRoleDrawerBodyStyle = styled.div`
  .detail-role-drawer__body {
    .role-name-container {
      padding-top: 38px;
      padding-bottom: 32px;
      border-bottom: 1px solid #595959;
      margin-bottom: 32px;

      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;

      .role-name {
        font-weight: 700;
      }
    }

    .user-count-container {
      font-style: normal;
      font-weight: 700;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 18px;
    }
    .ant-card {
      background: #262626;
      border-radius: 10px;
      padding: 19px;

      .ant-card-body {
        padding: 0px;
      }

      ul {
        padding-left: 19px;
        li {
          margin-bottom: 16px;
        }
      }
    }
  }
`;
