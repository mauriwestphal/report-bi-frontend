import styled from "styled-components";

export const TopSearchStyle = styled.div`
  .top-search-container {
    display: flex;
    justify-content: flex-end;
    width:100%;
    margin-bottom: 34px;
    &__search {
      margin-right: 220px;
      .ant-input-search {
        width: 400px;
      }

      .ant-input-group-wrapper {
        height: 42px;
        .ant-input-group {
          height: 100% !important;
          input {
            height: 100% !important;
            border: 0.8px solid #595959;
          }

          span {
            color: #FFFFFF !important;
            font-size: 16px;

            button {
              color: #FFFFFF !important;
              font-size: 16px;

            }
          }
        }
      }

      button {
        height: 100% !important;
      }
    }

    &__button {
      button {
        // height: 100% !important;
        min-width: 212px;
        z-index:999;
        font-size: 16px;
        color: #FFFFFF !important;
        span {
          color: #FFFFFF !important;

        }
      }
    }
  }
`;
