import styled from "styled-components";

export const TopTitleDashboardStyle = styled.div`
  .top-section {
    padding: 0px !important;
    display: flex;
    margin-top: 25px !important;
    justify-content: space-between;
    align-items: center;
      h1 {
        font-size: 28px !important;
        font-weight: 700 !important;
        font-family: "Arial" !important;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 100%;
          background-color: #fca82b;
          left: -40px;
          top: -4px !important;
        }
      }
      .anticon.anticon-calendar {
        color: white !important;
        margin-right: 9px;
      }

      .section-indicators {
        strong {
          font-size: 15px;
          color:white
        }
      }
    
  }
`;
