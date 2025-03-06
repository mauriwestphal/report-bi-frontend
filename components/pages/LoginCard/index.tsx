import { Button, Card } from "antd";
import Image from "next/image";
import AuthService from "../../../services/AuthService";
import { LoginCardStyle } from "./styled";

const LoginCard = () => {
  const onLogin = () => {
    AuthService.auth(window);
  };
  return (
    <LoginCardStyle>
      <div className="login-card-component">
        <div className="corner-dot" />
        <Card bordered={true}>
          <div style={{ textAlign: "center" }}>
            <Image
              src="/shared/gama.png"
              alt="gama icon name"
              width={190}
              height={37}
              className="gama-icon"
            />
          </div>
          <div className="login-text">
          <br />

            <p>
              <strong>Inició de sesión</strong>
            </p>
            <br />
            <p>
              Serás redireccionado al inicio de sesión de Microsoft. Debes
              acceder con tu correo y contraseña corporativa para acceder al
              sistema.
            </p>
          </div>
          <Button type="primary" block onClick={onLogin} className="login-button">
            Iniciar sesión
          </Button>
        </Card>
      </div>
    </LoginCardStyle>
  );
};

export default LoginCard;
