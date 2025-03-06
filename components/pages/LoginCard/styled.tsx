import styled from "styled-components";

export const LoginCardStyle = styled.div`
  .login-card-component {
    position: relative;
    width: 100%;
    height: 100%;
    .corner-dot {
      width: 53px !important;
      height: 53px;
      position: absolute;
      background: orange;
      border-radius: 100%;
      /* top: 43px; */
      right: -15px;
      top: -15px;
    }

    .ant-card {
      height: 100% !important;
      background: rgba(20, 20, 20, 0.3);
      padding: 69px 50px !important;
      /* Neutral/6 */

      border: 1px solid #bfbfbf;
      backdrop-filter: blur(12px);
      &-bordered {
        border: 1px solid #bfbfbf;
        border-radius: 20px;
      }

      .gama-icon {
        text-align: center;
        margin-bottom: 70px;
      }

      &-body {
        padding: 0px;
        .login-text {
          margin-bottom: 60px;
        }
        .login-button span {
          color: #ffffff !important;
        }
      }
    }
  }
`;
