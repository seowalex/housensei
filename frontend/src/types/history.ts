export interface PriceDataPoint {
  date: string;
  price: number;
}

export interface BTOProject {
  name: string;
  price: number;
  date: string;
}

export interface ChartDataPoint {
  date: string;
  [groupName: string]: string | number;
}
