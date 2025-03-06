import { LeftCircleOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import Image from "next/image";
import { ErrorLoginCardStyle } from "./styled";

interface ErrorLoginCard {
  title: string;
  description: string;
  onBack: () => void;
}

const ErrorLoginCard = ({ title, description, onBack }: ErrorLoginCard) => {
  return (
    <ErrorLoginCardStyle>
      <div className="error-login-card-component">
        <div className="corner-dot" />
        <Card bordered={true}>
          <div className="come-back-container">
            <Button type="link" onClick={onBack} style={{ padding: "0px" }}>
              {" "}
              <LeftCircleOutlined /> Volver atras
            </Button>
          </div>
          <div style={{ textAlign: "center" }}>
            <Image
              src="/shared/gama.png"
              alt="gama icon name"
              width={190}
              height={37}
              className="gama-icon"
            />
          </div>
          <div className="error-login-card">
            <p>
              <strong>{title}</strong>
            </p>
            <p>{description}</p>
          </div>
        </Card>
      </div>
    </ErrorLoginCardStyle>
  );
};

export default ErrorLoginCard;
