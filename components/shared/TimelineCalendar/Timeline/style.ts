import styled from "styled-components";

export const TimelineStyle = styled.div`
  .timeline-calendar {
    &.timeline {
      width: 100%;
      padding: 40px;
      position: relative;
      width: calc(100%);
      .line {
        padding: 1px;
        background: white;
        position: absolute;
        z-index: 1;
        left: 0;
        width: calc(100% - 15px);
      }
    }
  }
`;
