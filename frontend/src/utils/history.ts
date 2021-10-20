import {
  eachMonthOfInterval,
  eachYearOfInterval,
  format,
  getYear,
  max,
  min,
} from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { BTOGraphDataPoint } from '../api/history';
import type { BTOProjectsData } from '../reducers/history';
import { ChartDataPoint, PriceDataPoint } from '../types/history';
import { convertStringToDate } from './dates';

export const formatPrice = (price: number): string =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatPriceToThousand = (price: number): string => {
  if (price === 0) {
    return '0';
  }
  return `${Math.floor(price / 1000)}K`;
};

export const formatProjectName = (name: string): string => {
  const separators = [',', ' &'];
  const filteredSeparators = separators.filter(
    (separator) => name.split(separator).length > 1
  );
  if (filteredSeparators.length > 0) {
    const separator = filteredSeparators[0];
    return `${name.split(separator)[0]}${separator} ...`;
  }
  return name;
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
  resaleRawData: Record<string, PriceDataPoint[]>,
  btoRawData: Record<string, BTOProjectsData>
): ChartDataPoint[][] => {
  const monthlyDateToDataMap = new Map<
    string,
    Array<{ id: string; price: number }>
  >();
  const yearlyDateToDataMap = new Map<string, Record<string, number[]>>();

  Object.entries(resaleRawData).forEach(([id, dataPoints]) => {
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

  Object.values(btoRawData).forEach((projectsData) => {
    Object.entries(projectsData).forEach(
      ([id, { price, date: dateString }]) => {
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
      }
    );
  });

  const dates: Date[] = [];

  monthlyDateToDataMap.forEach((value, key) => {
    const date = convertStringToDate(key);
    if (date != null) {
      dates.push(date);
    }
  });

  if (dates.length === 0) {
    return [[], []];
  }

  const minDate = min(dates);
  const maxDate = max(dates);
  const months = eachMonthOfInterval({ start: minDate, end: maxDate });
  const monthlyChartData: ChartDataPoint[] = [];

  months.forEach((month) => {
    const monthString = format(month, 'yyyy-MM-dd');
    const chartDataPoint: ChartDataPoint = {
      date: monthString,
    };
    const data = monthlyDateToDataMap.get(monthString);

    if (data != null) {
      data.forEach(({ id, price }) => {
        chartDataPoint[id] = price;
      });
    }

    monthlyChartData.push(chartDataPoint);
  });

  const years = eachYearOfInterval({ start: minDate, end: maxDate });
  const yearlyChartData: ChartDataPoint[] = [];

  years.forEach((year) => {
    const yearString = format(year, 'yyyy');
    const chartDataPoint: ChartDataPoint = {
      date: yearString,
    };
    const data = yearlyDateToDataMap.get(yearString);

    if (data != null) {
      Object.entries(data).forEach(([id, [price, count]]) => {
        chartDataPoint[id] = Math.floor(price / count);
      });
    }

    yearlyChartData.push(chartDataPoint);
  });

  return [monthlyChartData, yearlyChartData];
};

export const transformRawBTOData = (
  dataPoints: BTOGraphDataPoint[]
): BTOProjectsData => {
  const projectsData: BTOProjectsData = {};

  dataPoints.forEach((dataPoint) => {
    const id = uuidv4();
    projectsData[id] = dataPoint;
  });

  return projectsData;
};
