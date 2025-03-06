import styled from "styled-components";

export const RelativeTimeHeaderStyle = styled.div`
  .timeline-calendar {
    &.relative-time-header {
      background-color: ${({ theme }) => theme.colorBgContainer};
      padding: 15px;
      width: 100%;

      .group-name {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 0px 10px;
        .date-group {
          &-name {
            text-align: center;
            font-size: 14px;
            color: white;
          }
        }
      }

      .group-values {
        display: flex;
        justify-content: space-between;
        .items {
          color: white;
          font-size: 14px;
        }
      }
    }
  }
`;
