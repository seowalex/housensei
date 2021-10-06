import { GroupFilters } from './groups';

interface PriceHistoryDataPoint {
  date: string;
  price: number;
}

export interface PriceHistory {
  filters: GroupFilters;
  history: PriceHistoryDataPoint[];
}
