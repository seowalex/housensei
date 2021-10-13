import { BackendFlatType } from './groups';

export interface PriceDataPoint {
  date: string;
  price: number;
}

export interface BTOProject {
  name: string;
  price: number;
  date: string;
  flatType: BackendFlatType;
}

export interface ChartDataPoint {
  date: string;
  [id: string]: string | number;
}

export enum ChartMode {
  Monthly,
  Yearly,
}
