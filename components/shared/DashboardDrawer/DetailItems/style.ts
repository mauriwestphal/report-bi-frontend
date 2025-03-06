import styled from "styled-components";
export const CarDetailsStyled = styled.div`
  .detail-items__container {
    .detail-items__header {
      display: flex;
      margin-bottom: 60px;
      .car-icon {
        width: 48px;
        height: 48px;
        padding: 12px;
        background-color: rgba(255, 255, 255, 0.06);
        border-radius: 6px;
        margin-right: 16px;
        svg {
          color: ${({ theme }) => theme.colorPrimary} !important;
          height: 24px;
          width: 24px;
        }
      }

      .car-text {
        .car-patent,
        .car-name {
          color: white;
          font-style: normal;
          font-size: 16px;
          line-height: 19px;
        }
        .car-patent {
          font-weight: 700;
        }
      }
    }

    .detail-items__details {
      .ant-col {
        color: white;
        font-style: normal;
        font-size: 14px;
        line-height: 17px;
        margin-bottom: 8px;
      }

      .title {
        font-weight: 700;
      }
    }
  }
`;
