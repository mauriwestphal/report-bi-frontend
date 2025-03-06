import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ErrorLoginCard from "../../components/pages/ErrorLoginCard";
import LoginCard from "../../components/pages/LoginCard";
import { LoginStyled } from "../../components/pages/styled";

const statusList = [
  {
    status: 401,
    description:
      "Tu cuenta no se encuentra creada. Solicita la creación a un administrador.",
    title: "Error de inicio de sesión",
  },
  {
    status: 403,
    description:
      "Tu cuenta se encuentra deshabilitada temporalmente. Comunícate con tu supervisor para poder acceder al sistema.",
    title: "Error de inicio de sesión",
  },
];

export default function AuthPage() {
  const router = useRouter();
  const [activeError, setActiveError] = useState<{
    status: number;
    description: string;
    title: string;
  }>();
  useEffect(() => {
    if (router.query && router.query.status) {
      const findStatus = statusList.find(
        (status) => Number(router.query.status) === status.status
      );
      if (findStatus) {
        setActiveError(findStatus);
      }
    }
  }, [router.query]);

  const handleBackFromError = () => {
    setActiveError(undefined);
    router.push("/auth", { query: {} });
  };
  return (
    <LoginStyled>
      <div className="login-page__container">
        <div className={activeError ? "error-login-card" : "login-card"}>
          {activeError ? (
            <ErrorLoginCard {...activeError} onBack={handleBackFromError} />
          ) : (
            <LoginCard />
          )}
        </div>
      </div>
    </LoginStyled>
  );
}
