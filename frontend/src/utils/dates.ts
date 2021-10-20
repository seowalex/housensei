import { compareAsc, format, isValid, parseISO } from 'date-fns';

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
