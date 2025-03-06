import styled from "styled-components";

export const TopTitleStyle = styled.div`
  .top-section {
    padding: 0px !important;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
      h1 {
        font-size: 24px;
        position: relative;
        &::before {
          content: "";
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 100%;
          background-color: #fca82b;
          left: -40px;
          top: 2px !important;
        }
      }
      .anticon.anticon-calendar {
        color: white !important;
        margin-right: 9px;
      }
    
  }

  .come-back-container {
    margin-bottom: 18px;
    text-align: center;
    .ant-btn-link {
      // padding-left: 0px;
      min-width: 212px;

      span {
        text-decoration: none !important;
        font-weight: 400;
        font-size: 17px;
      }

      .anticon {
        margin: 0px;
      }
    }
  }
`;
