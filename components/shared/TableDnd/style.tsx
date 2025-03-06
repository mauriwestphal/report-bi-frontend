import styled from "styled-components";

export const TableStyleDnd  = styled.div`
.customDiv{
  ::-webkit-scrollbar {
    display: none;
  }

  .button-more {
    border-radius: 8px !important;
    border : 1px solid #F60 !important;
    height: 45px !important;
    width: 10% !important;
    baground-color: transparent !important;
   
    span {
      color: #F60 !important;
    }
  }
}
table{
    border-spacing: 0px 20px !important;


}
  .custom-table-classname {
    
    .ant-table-wrapper,
    .ant-table {
      border-radius: 10px !important;   
      background: transparent !important;

    }
    .ant-table-content {
        background: transparent !important;

      .ant-table-thead {
        th {
          &.action-column {
            text-align: center;
          }
          background: ${({ theme }) => theme.colorBgContainer};
          border: none;

          &::before {
            content: none !important;
          }
        }
      }
      .ant-table-thead {
        position: sticky;
        z-index: 99;
        top: 0px !important;
      }
      .ant-table-tbody {
        tr > td {
          padding-top: 0px !important;
          padding-right: 16px;
          padding-bottom: 0px !important;
          padding-left: 16px;
        }
        .ant-table-cell {
        border: none !important;
        background: #232323 !important;
        }
        
        .class-first-colum {
            border-left: 5px solid #FF6600 !important;
            border-radius: 10px !important;
            border-top-right-radius: 0px !important;
            border-bottom-right-radius: 0px !important;

        }

        .class-last-column {
            border-radius: 10px !important;
            border-top-left-radius: 0px !important;
            border-bottom-left-radius: 0px !important;
        }

        .class-line-left {
            border-left: 2px solid #424242 !important;
            border-image: linear-gradient(to top, 
            rgba(66,66,66,0) 25%,
            rgba(66,66,66,1) 25%,
            rgba(66,66,66,1) 75%,
            rgba(66,66,66,0) 75%
            ) !important;
            border-image-slice: 1 !important;
        }
        
      }
    }
  }
  .top-level-inputs {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .row-disabled-element {
    td {
      color: ${({ theme }) => theme.colorTextDisabled};
    }
  }
`;
