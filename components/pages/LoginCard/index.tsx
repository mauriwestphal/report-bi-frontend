import AuthService from "../../../services/AuthService";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Button } from "../../ui/button";

const MicrosoftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 21 21"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);

const LoginCard = () => {
  const t = useTranslations("auth");

  const handleLogin = () => {
    AuthService.auth(window);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <span className="text-3xl font-bold tracking-tight">
              Bi<span className="text-primary">Pro</span>
            </span>
          </div>
          <CardTitle className="text-xl">{t("title")}</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLogin}>
            <MicrosoftIcon className="mr-2 h-4 w-4" />
            {t("button")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginCard;
