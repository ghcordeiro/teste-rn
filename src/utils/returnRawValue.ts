export default (data: { valueStart: string; valueEnd: string }) => {
  const newData = {
    valueStart: data.valueStart.replace(/\./g, ''),
    valueEnd: data.valueEnd.replace(/\./g, '')
  };

  return newData;
};
