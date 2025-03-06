import styled from "styled-components";

export const TableTabsStyled = styled.div`
  .table-tab-container {
    position: relative;
    overflow-x: auto;

    .top-search-container {
      position: absolute;
      top: -115px;
    }
  }

  @media screen and (max-width: 768px) {
    .table-tab-container  {
      overflow-x: scroll;
    }
    
    .ant-table {
      width: 100%;
      white-space: nowrap;
    }
  }
`;
