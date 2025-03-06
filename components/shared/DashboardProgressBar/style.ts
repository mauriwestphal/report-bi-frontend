import styled from "styled-components";

export const DashboardProgressBarStyled = styled.div`
    .dashboard_progress_bar__status_client {


      .title {
        color: #8c8c8c !important;
        text-align: center;
      }

      .progress_footer_text{
        margin-top: 8px;
        text-align: center;
      }

      .status_information {
        display: flex;
        justify-content: space-between;
    
        align-items: center;
      }
        .loader_status__container {
          width: 165px;
          border-radius: 5px;
          background-color: #c8cec6;
          position: relative;
          z-index: 2;
          text-align: center;
          span {
            color: #000000;
            position: relative;
            z-index: 4;
          }

          .loader_status__progress {
            
            position: absolute;
            height: 22px;
            border-radius: 5px;
            z-index: 3;
          }
        }
      }
    }

    .dashboard_progress_bar__status_user {
      width: 365px;
      background-color: #1a1a1a;
      border-radius: 18px;
      margin-bottom: 20px;
      padding: 14px 22px;

      .title {
        color: #8c8c8c !important;
        text-align: center;
      }

      .progress_footer_text{
        margin-top: 8px;
        text-align: center;
      }

      .status_information {
        display: flex;
        justify-content: space-between;

        .loader_status__container {
          text-align: center;
          width: 165px;
          border-radius: 5px;
          background-color: #c8cec6;
          position: relative;
          z-index: 2;

          span {
            color: #000000;
            position: relative;
            z-index: 4;
          }

          .loader_status__progress {
            position: absolute;
            height: 22px;
            border-radius: 5px;
            z-index: 3;
          }
        }
      }
    }
  }
`;
