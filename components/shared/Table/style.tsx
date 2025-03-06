import styled from "styled-components";

export const TableStyle = styled.div`
  .custom-table-classname {
    .ant-table-wrapper,
    .ant-table {
      border-radius: 10px !important;
      border-top-left-radius: 0px !important;
    }
    .ant-table-content {
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
      .ant-table-tbody {
        .ant-table-cell {
          border: none !important;
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
