import styled from "styled-components";

export const TimelineItemStyle = styled.div`
  .timeline-item {
    top: 34px;
    position: absolute;
    z-index: 2;
    text-align: center;

    .timeline-box {
      cursor: pointer;
      
      padding: 5px 0px;
      background-color: ${({ theme }) => theme.colorBgContainer};
      border: 1px solid #ffffff;
      border-radius: 5px;
      position: relative;
      .item-title {
        position: absolute;
        bottom: 15px;
        width: 100%;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
        font-weight: 400;
        font-size: 12px;
        line-height: 14px;
        margin: 0px;
      }
    }

    &.item-highlight {
      padding: 8px 0px;
      top: 18px;

      // .timeline-box {
      //   background-color: #DF545C;
      //   border: none;
      // }
      .item-title {
        position: static !important;
        color: ${({ theme }) => theme.colorBgContainer};
      }
    }
  }
`;
// background: # f0d233;
