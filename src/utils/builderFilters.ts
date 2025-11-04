export default (filter: {
  dateStart: number | undefined;
  dateEnd: number | undefined;
}): Array<string> => {
  const filters: Array<string> = [];

  if (filter.dateStart) {
    filters.push(`dateStart[eq]=${filter.dateStart}`);
  }
  if (filter.dateEnd) {
    filters.push(`dateEnd[eq]=${filter.dateEnd}`);
  }

  return filters;
};
