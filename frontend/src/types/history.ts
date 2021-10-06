import { GroupFilters } from './groups';

interface PriceDataPoint {
  date: string;
  price: number;
}

interface BTOProject {
  name: string;
  price: number;
  date: string;
}

export interface PriceHistory {
  filters: GroupFilters;
  history: PriceDataPoint[];
  projects: BTOProject[];
}
