export interface SystemClient {
  id: number;
  name: string;
  keyName: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}