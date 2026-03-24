import { PERMISSION_TYPE } from "../shared/enum/permission.enum";

interface ActionItem {
  permissions?: PERMISSION_TYPE[];
  [key: string]: any;
}

export const getValidatedItems = <T extends ActionItem>(
  items: T[],
  activePermissions?: PERMISSION_TYPE[]
): T[] => {
  if (!activePermissions) return items;

  return items.filter((item) => {
    if (!item.permissions || item.permissions.length === 0) return true;
    return item.permissions.some((p) => activePermissions.includes(p));
  });
};
