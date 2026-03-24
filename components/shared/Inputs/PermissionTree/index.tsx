import { Checkbox } from "../../../ui/checkbox";
import { Skeleton } from "../../../ui/skeleton";
import { IPermission } from "../../../layout/interfaces";

export interface PermissionGroup {
  name: string;
  permissions: IPermission[];
}

interface PermissionTreeProps {
  value: number[];
  onChange: (ids: number[]) => void;
  groups: PermissionGroup[];
  loading?: boolean;
}

const PermissionTree = ({ value, onChange, groups, loading }: PermissionTreeProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const groupIds = group.permissions.map((p) => p.id);
        const checkedCount = groupIds.filter((id) => value.includes(id)).length;
        const allChecked = checkedCount === groupIds.length && groupIds.length > 0;

        return (
          <div key={group.name} className="mb-4">
            {/* Group master checkbox */}
            <div className="flex items-center gap-2 mb-2 pb-1 border-b border-border">
              <Checkbox
                checked={allChecked}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...value, ...groupIds.filter((id) => !value.includes(id))]);
                  } else {
                    onChange(value.filter((id) => !groupIds.includes(id)));
                  }
                }}
              />
              <span className="font-medium text-sm capitalize">{group.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {checkedCount}/{groupIds.length}
              </span>
            </div>

            {/* Individual permissions */}
            <div className="ml-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {group.permissions.map((permission) => (
                <div key={permission.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`perm-${permission.id}`}
                    checked={value.includes(permission.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChange([...value, permission.id]);
                      } else {
                        onChange(value.filter((id) => id !== permission.id));
                      }
                    }}
                  />
                  <label
                    htmlFor={`perm-${permission.id}`}
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PermissionTree;
