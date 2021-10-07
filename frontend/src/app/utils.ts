import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'SGD',
  currencyDisplay: 'narrowSymbol',
  maximumFractionDigits: 0,
});
