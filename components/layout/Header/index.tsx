import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "../../ui/button";
import { ThemeToggle } from "../../shared/ThemeToggle";
import { LanguageToggle } from "../../shared/LanguageToggle";
import { useAppContext } from "../../../context/AppContext";
import { PERMISSION_TYPE } from "../../../shared/enum/permission.enum";
import { useTranslations } from "next-intl";
import { removeToken } from "../../../utils/auth";

const navItemConfig = [
  {
    labelKey: "reports",
    href: "/report",
    permissions: undefined as PERMISSION_TYPE[] | undefined,
    position: 1,
  },
  {
    labelKey: "monitors",
    href: "/monitor",
    permissions: [
      PERMISSION_TYPE.CAN_CREATE_MONITOR,
      PERMISSION_TYPE.CAN_EDIT_MONITOR,
      PERMISSION_TYPE.CAN_DELETE_MONITOR,
      PERMISSION_TYPE.CAN_GENERATE_NEW_URL,
      PERMISSION_TYPE.CAN_ENABLE_MONITOR,
    ] as PERMISSION_TYPE[],
    position: 2,
  },
  {
    labelKey: "usersRoles",
    href: "/user-role",
    permissions: [
      PERMISSION_TYPE.CAN_CREATE_ROLE,
      PERMISSION_TYPE.CAN_CREATE_USER,
      PERMISSION_TYPE.CAN_DELETE_ROLE,
      PERMISSION_TYPE.CAN_EDIT_ROLE,
      PERMISSION_TYPE.CAN_EDIT_USER,
      PERMISSION_TYPE.CAN_ENABLE_USER,
    ] as PERMISSION_TYPE[],
    position: 3,
  },
];

export default function Header() {
  const { user } = useAppContext();
  const router = useRouter();
  const t = useTranslations("nav");

  const getValidatedItems = () => {
    const result: typeof navItemConfig = [];
    for (const item of navItemConfig) {
      if (!item.permissions) {
        result.push(item);
        continue;
      }
      if (user && item.permissions.some((p) => user.activePermissions.includes(p))) {
        result.push(item);
      }
    }
    return result.sort((a, b) => a.position - b.position);
  };

  const handleCloseSession = () => {
    removeToken();
    router.push("/auth");
  };

  const navItems = getValidatedItems();
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        {/* Logo */}
        <span className="text-lg font-bold tracking-tight mr-8 select-none">
          Bi<span className="text-primary">Pro</span>
        </span>

        {/* Nav — RBAC filtered */}
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={router.pathname.startsWith(item.href) ? "secondary" : "ghost"}
                size="sm"
              >
                {t(item.labelKey as any)}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right: LanguageToggle + ThemeToggle + Avatar */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <div
            className="flex items-center gap-2 ml-2 cursor-pointer group"
            onClick={handleCloseSession}
            title="Cerrar sesión"
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium group-hover:opacity-80 transition-opacity">
              {initials}
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.firstName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
