import styled from "styled-components";

export const CardInfoStyle = styled.div`
  @media (max-width: 800px) {
    .icon-framework {
      display: none;
    }

    .icon-button{
      display: none;
    }
  }

  .card-info-container {
    position: relative;
    width: 100%;
    height: 100%;
    margin-bottom: 12px;
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

    &__content {
      .anticon {
        padding: 12px;
        border-radius: 10px;
        background: ${(props) => props.theme.colorPrimaryBg};
        border: 1px solid ${(props) => props.theme.colorPrimaryBorder};
        color: ${(props) => props.theme.colorPrimary};
        margin-right: 12px;
        svg {
          width: 24px;
          height: 24px;
        }
      }
    }
    &__title {
      display: flex;
      align-items: center;
      h2 {
        margin: 0px;
        // margin-left: 12px;
      }
    }

    &__body {
      margin-top: 25px;
      margin-bottom: 45px;
      ul {
        padding-left: 4%;
        color: #bfbfbf;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
      }
    }
    .ant-card {
      padding: 22px 32px 32px 32px;

      height: 100% !important;
      background: #1c1c1c;

      .gama-icon {
        text-align: center;
        margin-bottom: 70px;
      }

      &-body {
        padding: 0px;
      }
    }

    // .card-info-container__footer{
    //   border: 2px solid black;
    //   width: 100% !important;
    // }
    &__footer {
      
      margin: auto;
      .ant-btn {
        width: 100%;
        margin-top: 32px;
        height: 42px;
        border-color: ${(props) => props.theme.colorPrimary};
        span {
          font-weight: 700;
          font-size: 16px;
          color: ${(props) => props.theme.colorPrimary};
        }

        .anticon {
          svg {
            width: 18px;
            height: 18px;
          }
        }
      }
    }
  }
`;
