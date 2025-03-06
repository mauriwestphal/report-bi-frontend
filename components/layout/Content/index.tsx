import { Layout } from "antd";
import React, { CSSProperties } from "react";

const { Content: AntdContent } = Layout;

const Content = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <AntdContent className="content-classname" style={style}>
      {children}
    </AntdContent>
  );
};

export default Content;
