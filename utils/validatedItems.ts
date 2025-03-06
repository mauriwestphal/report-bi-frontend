import { PERMISSION_TYPE } from "../shared/enum/permission.enum";

export function getValidatedItems<T>(
  forValidateItems: T[],
  activePermissions: PERMISSION_TYPE[] | undefined
): T[] {
  let items = [];
  for (const item of forValidateItems) {
    if (activePermissions) {
      const hasPermission = item.permissions
        ? item.permissions.some((permission: PERMISSION_TYPE) =>
            activePermissions.includes(permission)
          )
        : true;

      if (hasPermission) {
        items.push(item);
      }
    }
  }
 
  return items;
}
