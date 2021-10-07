import { compareAsc, parseISO } from 'date-fns';
import { ChartDataPoint, PriceHistory } from '../types/history';

export const convertStringToDate = (string: string): Date => parseISO(string);

const upsertMap = (
  map: Map<string, any>,
  key: string,
  value: any,
  updateFn: (value: any) => any
) => {
  if (map.has(key)) {
    map.set(key, updateFn(map.get(key)));
  } else {
    map.set(key, value);
  }
};

export const getChartData = (histories: PriceHistory[]): ChartDataPoint[] => {
  const dateToDataMap = new Map<
    string,
    Array<{ groupName: string; price: number }>
  >();

  histories.forEach(({ group, history }) => {
    history.forEach(({ date, price }) => {
      const dataPoint = { groupName: group.name, price };
      upsertMap(dateToDataMap, date, [dataPoint], (array) => [
        ...array,
        dataPoint,
      ]);
    });
  });

  const chartData: ChartDataPoint[] = [];

  dateToDataMap.forEach((value, key) => {
    const chartDataPoint: ChartDataPoint = {
      date: key,
    };
    value.forEach(({ groupName, price }) => {
      chartDataPoint[groupName] = price;
    });
    chartData.push(chartDataPoint);
  });

  chartData.sort((left, right) => {
    const leftDate = convertStringToDate(left.date);
    const rightDate = convertStringToDate(right.date);
    return compareAsc(leftDate, rightDate);
  });

  return chartData;
};
