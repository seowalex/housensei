import { compareAsc, format, getYear, isValid, parseISO } from 'date-fns';
import { Group } from '../types/groups';
import { ChartDataPoint, PriceDataPoint } from '../types/history';

export const convertStringToDate = (dateString: string): Date | undefined => {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return undefined;
  }
  return date;
};

export const formatDate = (dateString: string): string => {
  const date = convertStringToDate(dateString);
  if (date == null) {
    return dateString;
  }

  return format(date, 'MMM yyyy');
};

export const formatPrice = (price: number): string => {
  if (price === 0) {
    return '0';
  }
  return `${Math.floor(price / 1000)}K`;
};

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
): ChartDataPoint[][] => {
  const monthlyDateToDataMap = new Map<
    string,
    Array<{ groupName: string; price: number }>
  >();
  const yearlyDateToDataMap = new Map<string, Record<string, number[]>>();

  Object.entries(rawData).forEach(([id, dataPoints]) => {
    const { name } = groups[id];

    dataPoints.forEach(({ price, date: dateString }) => {
      const dataPoint = { groupName: name, price };
      upsertMap(monthlyDateToDataMap, dateString, [dataPoint], (array) => [
        ...array,
        dataPoint,
      ]);

      const date = convertStringToDate(dateString);
      if (date == null) {
        return;
      }
      const year = getYear(date).toString();
      upsertMap(yearlyDateToDataMap, year, { [name]: [price, 1] }, (record) => {
        const current = record[name] ?? [0, 0];
        return { ...record, [name]: [current[0] + price, current[1] + 1] };
      });
    });
  });

  const monthlyChartData: ChartDataPoint[] = [];
  const yearlyChartData: ChartDataPoint[] = [];

  monthlyDateToDataMap.forEach((value, key) => {
    const chartDataPoint: ChartDataPoint = {
      date: key,
    };
    value.forEach(({ groupName, price }) => {
      chartDataPoint[groupName] = price;
    });
    monthlyChartData.push(chartDataPoint);
  });

  monthlyChartData.sort((left, right) => {
    const leftDate = convertStringToDate(left.date);
    const rightDate = convertStringToDate(right.date);
    if (leftDate == null) {
      return -1;
    }
    if (rightDate == null) {
      return 1;
    }
    return compareAsc(leftDate, rightDate);
  });

  yearlyDateToDataMap.forEach((value, key) => {
    const chartDataPoint: ChartDataPoint = {
      date: key,
    };
    Object.entries(value).forEach(([groupName, [price, count]]) => {
      chartDataPoint[groupName] = Math.floor(price / count);
    });
    yearlyChartData.push(chartDataPoint);
  });

  return [monthlyChartData, yearlyChartData];
};
