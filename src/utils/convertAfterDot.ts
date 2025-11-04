export default (value: number, decimal?: number) => {
  if (value) {
    if (decimal) {
      return value.toFixed(decimal);
    }
  }
  return value;
};
