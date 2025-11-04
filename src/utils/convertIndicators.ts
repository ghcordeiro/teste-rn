/**
 * Add periods to a numeric string value.
 * @param value - A numeric string value.
 */
const addPeriods = (value: string): string =>
  value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

export default (value: number | string | undefined): string => {
  const number = Number(value).toFixed(2).replace('.', ',');
  return addPeriods(number);
};
