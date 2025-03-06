export enum Direction {
  DESCENDANT = "DESC",
  ASCENDANT = "ASC",
}

export interface List {
  skip?: number;

  take?: number;

  sortField?: string;

  sortOrder?: Direction;

  search?: string;
}

export interface ListMonitor {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListReport {
  icon?: string,
    title: string,
    body: string,
    url: string,
    pemission?: boolean
}