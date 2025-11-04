export default <T>(array: any[], property: any, sum?: any): T[] => {
  const result: T[] = [];

  array.reduce((res, value) => {
    if (!res[value[property]]) {
      res[value[property]] = { [property]: value[property], [sum]: 0 };
      result.push(res[value[property]]);
    } else {
      res[value[property]][sum] += value[sum];
    }
    return res;
  }, {});

  return result;
};
