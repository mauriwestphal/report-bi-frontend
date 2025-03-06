import { theme } from "antd";
import styled from "styled-components";

export const ActionMenuStyle = styled.div`
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
`;
