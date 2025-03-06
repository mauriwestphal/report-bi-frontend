import { Modal } from "antd";
import { ReactNode } from "react";
import { StandardModalBodyStyle, StandardModalFooterStyle } from "./style";

export interface IStandardModalProps {
  width?: number;
  onCancel?: () => void;
  open: boolean;
  content: ReactNode;
  footer?: ReactNode;
}

const StandardModal = ({
  width,
  onCancel,
  open,
  content,
  footer,
}: IStandardModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      width={width}
      footer={
        footer ? (
          <StandardModalFooterStyle>
            <div className="standard-modal-footer__container">{footer}</div>
          </StandardModalFooterStyle>
        ) : null
      }
    >
      <StandardModalBodyStyle>
        <div className="standard-modal-body__container">{content}</div>
      </StandardModalBodyStyle>
    </Modal>
  );
};

export default StandardModal;
