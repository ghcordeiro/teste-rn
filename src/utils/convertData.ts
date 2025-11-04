import convertHours from './convertHours';

export default (
  date: number,
  divider: string,
  timestamp = false,
  yearFormat: 'full' | 'condensed' = 'condensed'
) => {
  const newDate = new Date(date);
  const year = newDate.getUTCFullYear();
  const month = `0${newDate.getUTCMonth() + 1}`.slice(-2);
  const day = `0${newDate.getUTCDate()}`.slice(-2);

  const dateStr = `${day}${divider}${month}${divider}${
    yearFormat === 'full' ? year : year.toString().substr(2, 2)
  }${timestamp ? ` ${convertHours(date)}` : ''}`;

  return dateStr;
};
