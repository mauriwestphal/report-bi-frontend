import { IPermission, IReportPage } from "../../components/layout/interfaces";

interface RoleInterface {
  id: number;
  name: string;
  keyName?: string;
  isActive?: boolean;
  permissions: IPermission[];
  reportPages?: IReportPage[];
  totalUsers?: number;
}

export default RoleInterface;
