import styled from "styled-components";

export const DetailOrderCardStyle = styled.div`
  .detail-order-card {
    &__container {
      background-color: #1F2123;

      .ant-card-body {
        padding: 16px;
      }
    }

    &__information {
      width: 400px;
      .title {
        font-weight: 700;
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 16px;
      }
    }
  }
`;
