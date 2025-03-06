import styled from "styled-components";

export const UserRoleStyle = styled.div`
  .user-role-component {
    .ant-tabs-nav {
      &::before {
        content: none !important;
      }
      margin-bottom: 0px;
    }

    .ant-tabs-tab {
      color: white !important;
      margin-right: 10px;
      border: none;
      background-color: #262626 !important;

      min-width: 120px;
      justify-content: center;

      &-active {
        background-color: ${({ theme }) => theme.colorBgContainer} !important;
      }
    }

    .ant-tabs-tab-btn {
      color: white !important;
    }
  }
`;
