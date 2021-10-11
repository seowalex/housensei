// eslint-disable-next-line import/prefer-default-export
export const constructQueryString = (
  params: Record<string, unknown>
): string => {
  const queryString = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((element) => queryString.append(key, element));
    } else if (value != null) {
      queryString.append(key, value as string);
    }
  });
  return `?${queryString.toString()}`;
};
