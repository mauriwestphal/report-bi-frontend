import styled from "styled-components";

export const HeaderStyled = styled.div`
  .ant-layout-header {
    height: 83px !important;
    border: none;
    border-bottom: 1px solid #373737;
    background-color: #141414 !important;
    padding: 25px 24px !important;
    margin-bottom: 32px;
    .header_container__content {
      display: flex;
      justify-content: space-between;
      height: 100%;
    }
    .gama-icon {
      width: 100%;
      max-width: 169px;
      height: 24px;
    }
    .ant-menu-dark {
      background-color: #141414 !important;
    }

    .route-menu {
      .ant-menu {
        height: 100%;
        &-item-active {
          border: 1px solid ${({ theme }) => theme.colorPrimaryActive};
          border-radius: 8px;
          background: #ff660033;
        }
      }
    }

    .menu-user-options {
      line-height: 0 !important;
    }
    .action-menu-container {
      text-align: center;

      button {
        background: #ff660014;
        border: 1px solid ${({ theme }) => theme.colorPrimaryActive} !important;

        span {
          color: ${({ theme }) => theme.colorPrimaryActive};
        }

        &.ant-dropdown-open {
          background: ${({ theme }) => theme.colorPrimaryActive} !important;
          border: none !important;

          span {
            color: #f0f0f0 !important;
          }
        }
      }
    }
  }
`;
