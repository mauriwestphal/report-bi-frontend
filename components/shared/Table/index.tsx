import { Table as AntTable, TableProps } from "antd";
import { TableStyle } from "./style";

const Table = ({ ...props }: TableProps<any>) => {
  return (
    <TableStyle>
      <AntTable
        {...props}
        rowKey="uid"
        className="custom-table-classname"
        pagination={{ ...props.pagination, position: ["bottomCenter"] }}
      />
    </TableStyle>
  );
};

export default Table;
