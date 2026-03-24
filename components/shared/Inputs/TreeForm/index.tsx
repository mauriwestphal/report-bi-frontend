import { Form, FormInstance, Skeleton, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import { useEffect, useState } from "react";

interface TreeFormProps {
  name: string;
  form: FormInstance<any>;
  label: string;
  permissions: DataNode[];
  loading: boolean;
}

const TreeForm = ({
  name,
  form,
  label,
  permissions,
  loading,
}: TreeFormProps) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const selectedPermissions: (string | number)[] = Form.useWatch(name, form);

  useEffect(() => {
    if (selectedPermissions && Array.isArray(selectedPermissions)) {
      setCheckedKeys(selectedPermissions);
      setExpandedKeys(selectedPermissions);
    }
  }, [selectedPermissions]);

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setAutoExpandParent(false);
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck = (checkedKeysValue: any) => {
    const childKeys = checkedKeysValue.filter(
      (element: any) => typeof element === "number"
    );

    form.setFieldValue(name, childKeys);
    setCheckedKeys(checkedKeysValue);
  };

  const titleRender = (nodeData: any): React.ReactNode => {
    if (nodeData.children && nodeData.children.length > 0) {
      const total = nodeData.children.length;
      const selected = nodeData.children.filter((child: any) =>
        checkedKeys.includes(child.key)
      ).length;
      return (
        <span>
          {nodeData.title} ({selected}/{total})
        </span>
      );
    }
    return <span>{nodeData.title}</span>;
  };

  return (
    <Form.Item name={name} label={label}>
      <Skeleton loading={loading}>
        <Tree
          checkable
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          onExpand={onExpand}
          checkedKeys={checkedKeys}
          treeData={permissions}
          titleRender={titleRender}
        />
      </Skeleton>
    </Form.Item>
  );
};

export default TreeForm;
