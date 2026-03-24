import { useMemo } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../ui/button";
import { useLocale } from "../../../context/LocaleContext";

interface PageHeaderProps {
  title: string;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    icon?: React.ReactNode;
  };
  showBack?: boolean;
  backRoute?: string;
  showDate?: boolean;
}

export function PageHeader({
  title,
  action,
  showBack,
  backRoute,
  showDate,
}: PageHeaderProps) {
  const router = useRouter();
  const { locale } = useLocale();

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString(locale === "es" ? "es-CL" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [locale]);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(backRoute || "/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {showDate && (
          <span className="text-sm text-muted-foreground capitalize">
            {formattedDate}
          </span>
        )}
        {action && (
          <Button onClick={action.onClick} disabled={action.disabled} size="sm">
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
