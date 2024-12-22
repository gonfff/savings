import { PaginatedResponse } from '@/types/base';

export interface PaginatedContainerProps {
  limit: number;
  offset: () => number;
  setOffset: (offset: number) => void;
  items: () => any[] | null;
  setItems: (items: any[] | null) => void;
  fetchFunction: (
    limit: number,
    offset: number,
  ) => Promise<PaginatedResponse<any>>;
}
