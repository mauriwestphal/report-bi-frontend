import RoleInterface from "./Role.interface";

export default interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleInterface;
}
