export default (days: number): string => {
  const years = Math.floor(days / 365);
  const yearsStr = years > 0 ? `${years.toString()}a ` : '';
  const months = Math.floor((days % 365) / 30);
  const monthsStr = months > 0 ? `${months.toString()}m` : '';
  const result =
    yearsStr.length > 0 || monthsStr.length > 0
      ? `(${yearsStr}${monthsStr})`
      : `${yearsStr}${monthsStr}`;
  return result;
};
