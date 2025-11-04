import { addMinutes } from 'date-fns';

function formatDate(date: Date) {
  return addMinutes(date, date.getTimezoneOffset());
}

export default (date: number, tpRetorno: string) => {
  const newDate = formatDate(new Date(date));
  const year = newDate.getFullYear();
  const month = `0${newDate.getMonth() + 1}`.slice(-2);
  const day = `0${newDate.getDate()}`.slice(-2);

  if (tpRetorno === 'year') {
    return year;
  }
  if (tpRetorno === 'month') {
    return month;
  }
  if (tpRetorno === 'daymonth') {
    return `${day} ${month}`;
  }
  if (tpRetorno === 'daymonthyear') {
    return `${day} ${month} ${year.toString().substr(2, 2)}`;
  }
  if (tpRetorno === 'monthyear') {
    return `${month} ${year.toString().substr(2, 2)}`;
  }
  return day;
};
