import { Button, Space } from "antd";
import { useState } from "react";
import StandardModal, { IStandardModalProps } from "../StandardModal";

interface IActionMenuModalProps extends Omit<IStandardModalProps, "onOk"> {
  actionalId: any;
  onConfirm: (id: any) => Promise<void>;
  title?:string,
  title2?:string,
  showFooter?: boolean;
}

const footer = (
  loading: boolean,
  onOk: () => Promise<void>,
  onCancel: () => any,
  title?: string,
  title2?: string
) => {
  return (
    <Space>
      <Button
        onClick={() => onCancel()}
        style={{ padding: "8px 24px", height: "100%", borderRadius: "36px" }}
      >
        {title2 ? title2 : 'Cancelar'}
      </Button>
      <Button
        loading={loading}
        type="primary"
        style={{ padding: "8px 64px", borderRadius: "36px" }}
        onClick={async () => await onOk()}
      >
        {title ? title : 'Aceptar'}
      </Button>
    </Space>
  );
};

const ActionMenuModal = ({
  actionalId,
  onConfirm,
  title,
  title2,
  showFooter,
  ...props
}: IActionMenuModalProps) => {
  const [loading, setLoading] = useState(false);
  const handleOk = async () => {
    setLoading(true);
    await onConfirm(actionalId);
    setLoading(false);

    if (props.onCancel) {
      props.onCancel();
    }
  };

  return (
    <StandardModal
      {...props}
      footer={showFooter === false ? '' : footer(loading, handleOk, props.onCancel as any, title, title2)}
    />
  );
};

export default ActionMenuModal;
