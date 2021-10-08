import { compareAsc, parseISO } from 'date-fns';
import { Group } from '../types/groups';
import { ChartDataPoint, PriceDataPoint } from '../types/history';

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

export const getChartData = (
  rawData: {
    [id: string]: PriceDataPoint[];
  },
  groups: Record<string, Group>
): ChartDataPoint[] => {
  const dateToDataMap = new Map<
    string,
    Array<{ groupName: string; price: number }>
  >();

  Object.entries(rawData).forEach(([id, dataPoints]) => {
    const { name } = groups[id];

    dataPoints.forEach(({ price, date }) => {
      const dataPoint = { groupName: name, price };
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
