function translate(key: string, count: number) {
  if (key === 'daysAgo') return `há ${count} dias`;
  if (key === 'dayAgo') return `há ${count} dia`;
  if (key === 'hoursAgo') return `há ${count} horas`;
  if (key === 'hourAgo') return `há ${count} hora`;
  if (key === 'minAgo') return `há ${count} min`;
  if (key === 'days') return ` ${count} dias`;
  if (key === 'day') return ` ${count} dia`;
  if (key === 'hours') return ` ${count} horas`;
  if (key === 'hour') return ` ${count} hora`;
  if (key === 'min') return ` ${count} min`;
}

function returnWorkDays(startDate: Date, endDate: Date) {
  const oneDay = 86400000;
  let discountDays = 0;

  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
  let differenceInDays = Math.floor(differenceInMilliseconds / oneDay);
  if (differenceInDays >= 1) {
    while (differenceInDays > 0) {
      const dayOfWeekEndDate = new Date(
        endDate.getTime() - differenceInDays * oneDay
      ).getDay();
      if (dayOfWeekEndDate === 0 || dayOfWeekEndDate === 6) {
        discountDays += 1;
      }
      differenceInDays -= 1;
    }
  }
  return differenceInMilliseconds - oneDay * discountDays;
}

/**
  @param startDate Date - first date to compare
  @param endDate Date - second date to compare
  @returns number - number of days between the two dates
*/
export default function calculateBusinessHours(
  dataInicial: Date,
  dataFinal?: Date,
  showAgo = true
) {
  const ago = showAgo ? 'Ago' : '';
  const finalDate = dataFinal || new Date();
  const workDaysInMilliseconds = returnWorkDays(dataInicial, finalDate);

  const diffDays = Math.floor(workDaysInMilliseconds / 86400000);
  const diffHrs = Math.floor((workDaysInMilliseconds % 86400000) / 3600000);
  const diffMins = Math.round(
    ((workDaysInMilliseconds % 86400000) % 3600000) / 60000
  );

  let str = '';
  if ((diffDays > 0 && diffHrs === 0) || diffMins === 0) {
    return (str += translate(
      `${diffDays > 1 ? `days${ago}` : `day${ago}`}`,
      diffDays
    ));
  }
  if (diffDays > 0) {
    return (str += translate(
      `${diffDays > 1 ? `days${ago}` : `day${ago}`}`,
      diffDays
    ));
  }
  if (diffHrs > 0) {
    return (str += translate(
      `${diffHrs > 1 ? `hours${ago}` : `hour${ago}`}`,
      diffHrs
    ));
  }
  return (str += translate(`min${ago}`, diffMins));
}
