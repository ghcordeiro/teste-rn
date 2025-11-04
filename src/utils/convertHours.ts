export default (date: number) => {
  const newDate = new Date(date);
  const hour = `0${newDate.getUTCHours()}`.slice(-2);
  const minutes = `0${newDate.getUTCMinutes()}`.slice(-2);

  const dateStr = `${hour}:${minutes}`;

  return dateStr;
};
