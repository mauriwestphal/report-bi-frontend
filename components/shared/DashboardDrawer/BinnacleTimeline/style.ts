import styled from "styled-components";

export const BinnacleTimelineStyled = styled.div`
  .ant-spin-nested-loading {
    height: 100%;

    .ant-spin-container {
      height: 100%;
    }
  }
  .binnacle-timeline {
    &__container {
      height: 100%;
      margin-bottom: 10px;
    }
    padding: 6px;
    max-height: 100%;
    overflow-y: auto;
    // overflow-y: auto;
    .ant-timeline-item-tail {
      margin-top: 6px;
      height: calc(100% - 24px);
      border-inline-start: 1px solid rgba(255, 255, 255, 0.3);
    }

    .anticon {
      svg {
        width: 20px;
        height: 20px;
      }
    }

    .system-binnacle-item {
      .date {
        margin-bottom: 20px;
        display: block;
      }
      .title {
        margin: 0px;
      }
    }
    .note-binnacle-item {
      .date {
        margin-bottom: 20px;
        display: block;
        font-size: 10px !important;
      }
      .title {
        margin: 0px;
      }
    }
    .ant-timeline-item-content {
      p,
      span {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
      }
      .date {
        color: #ffffffb2;
      }

      .description {
        font-weight: 400;
        font-size: 12px;
        line-height: 16px;
        margin-bottom: 20px;
      }
    }
  }
  .submit-binnacle-note {
    input {
      background-color: white !important;
      border-color: none;
      width: 400px;
      ::placeholder {
        color: #8c8c8c !important;
      }
      color: #8c8c8c !important;
    }

    .ant-btn-primary {
      background-color: rgba(255, 255, 255, 0.06);
      width: 38px;
      .anticon {
        svg {
          width: 20px;
          height: 20px;
          color: ${({ theme }) => theme.colorPrimary};
        }
      }
    }
  }
`;
