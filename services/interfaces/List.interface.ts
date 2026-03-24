export enum Direction {
  ASCENDANT = "ASC",
  DESCENDANT = "DESC",
}

export interface List {
  take?: number;
  skip?: number;
  search?: string;
  sortField?: string;
  sortOrder?: Direction;
}

export interface ListMonitor {
  search?: string;
  limit?: number;
  offset?: number;
}
