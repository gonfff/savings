export interface PaginatedResponse<T> {
  items: T[];
  next: boolean;
}
