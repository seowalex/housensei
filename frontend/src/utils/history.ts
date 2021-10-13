import { compareAsc, format, getYear, isValid, parseISO } from 'date-fns';
import { BTOGraphDataPoint } from '../api/history';
import { BackendFlatType, Group } from '../types/groups';
import { ChartDataPoint, PriceDataPoint } from '../types/history';
import { convertFlatTypeToFrontend } from './groups';

export const convertStringToDate = (dateString: string): Date | undefined => {
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return undefined;
  }
  return date;
};

export const compareDates = (left: string, right: string): number => {
  const leftDate = convertStringToDate(left);
  const rightDate = convertStringToDate(right);
  if (leftDate == null) {
    return -1;
  }
  if (rightDate == null) {
    return 1;
  }
  return compareAsc(leftDate, rightDate);
};

export const formatDate = (dateString: string): string => {
  const date = convertStringToDate(dateString);
  if (date == null) {
    return dateString;
  }

  return format(date, 'MMM yyyy');
};

export const formatPrice = (price: number): string =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatPriceToThousand = (price: number): string => {
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

export const getChartData = (rawData: {
  [id: string]: PriceDataPoint[];
}): ChartDataPoint[][] => {
  const monthlyDateToDataMap = new Map<
    string,
    Array<{ id: string; price: number }>
  >();
  const yearlyDateToDataMap = new Map<string, Record<string, number[]>>();

  Object.entries(rawData).forEach(([id, dataPoints]) => {
    dataPoints.forEach(({ price, date: dateString }) => {
      const dataPoint = { id, price };
      upsertMap(monthlyDateToDataMap, dateString, [dataPoint], (array) => [
        ...array,
        dataPoint,
      ]);

      const date = convertStringToDate(dateString);
      if (date == null) {
        return;
      }
      const year = getYear(date).toString();
      upsertMap(yearlyDateToDataMap, year, { [id]: [price, 1] }, (record) => {
        const current = record[id] ?? [0, 0];
        return { ...record, [id]: [current[0] + price, current[1] + 1] };
      });
    });
  });

  const monthlyChartData: ChartDataPoint[] = [];
  const yearlyChartData: ChartDataPoint[] = [];

  monthlyDateToDataMap.forEach((value, key) => {
    const chartDataPoint: ChartDataPoint = {
      date: key,
    };
    value.forEach(({ id, price }) => {
      chartDataPoint[id] = price;
    });
    monthlyChartData.push(chartDataPoint);
  });

  monthlyChartData.sort((left, right) => compareDates(left.date, right.date));

  yearlyDateToDataMap.forEach((value, key) => {
    const chartDataPoint: ChartDataPoint = {
      date: key,
    };
    Object.entries(value).forEach(([id, [price, count]]) => {
      chartDataPoint[id] = Math.floor(price / count);
    });
    yearlyChartData.push(chartDataPoint);
  });

  return [monthlyChartData, yearlyChartData];
};

export const aggregateBTOProjects = (
  dataPoints: BTOGraphDataPoint[]
): BTOGraphDataPoint[] => {
  const aggregatedProjectsMap = new Map<
    BackendFlatType,
    { totalPrice: number; count: number }
  >();

  dataPoints.forEach(({ price, flatType }) => {
    upsertMap(
      aggregatedProjectsMap,
      flatType,
      { totalPrice: price, count: 1 },
      (record) => ({
        totalPrice: record.totalPrice + price,
        count: record.count + 1,
      })
    );
  });

  const aggregatedProjectsData: BTOGraphDataPoint[] = [];

  aggregatedProjectsMap.forEach(({ totalPrice, count }, key) => {
    const projectsDataPoint: BTOGraphDataPoint = {
      name: `${convertFlatTypeToFrontend(key)} Average`,
      price: Math.floor(totalPrice / count),
      date: '',
      flatType: key,
    };

    aggregatedProjectsData.push(projectsDataPoint);
  });

  return aggregatedProjectsData;
};
