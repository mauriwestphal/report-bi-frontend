import { Button, Card } from "antd";
import AuthService from "../../../services/AuthService";
import { LoginCardStyle } from "./styled";
import { useTranslations } from "next-intl";

const LoginCard = () => {
  const t = useTranslations("auth");

  const onLogin = () => {
    AuthService.auth(window);
  };
  return (
    <LoginCardStyle>
      <div className="login-card-component">
        <div className="corner-dot" />
        <Card bordered={true}>
          <div style={{ textAlign: "center", padding: '8px 0' }}>
            <span style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              Bi<span style={{ color: '#3b82f6' }}>Pro</span>
            </span>
          </div>
          <div className="login-text">
          <br />

            <p>
              <strong>{t("title")}</strong>
            </p>
            <br />
            <p>{t("subtitle")}</p>
          </div>
          <Button type="primary" block onClick={onLogin} className="login-button">
            {t("button")}
          </Button>
        </Card>
      </div>
    </LoginCardStyle>
  );
};

export default LoginCard;
