import { Group } from './groups';

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
  group: Group;
  history: PriceDataPoint[];
  projects: BTOProject[];
}
