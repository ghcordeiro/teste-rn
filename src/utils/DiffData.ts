import { translate } from '@translate';

export default (
  dataInicial: number,
  dataFinal?: number,
  showAgo = true
): string => {
  const ago = showAgo ? 'Ago' : '';
  const finalDate = dataFinal || new Date().getTime();
  const diffMs = finalDate - dataInicial;
  const diffDays = Math.floor(diffMs / 86400000);
  const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
  const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

  let str = '';
  if (diffDays > 0) {
    return (str += translate(`${diffDays > 1 ? `days${ago}` : `day${ago}`}`, {
      count: diffDays
    }));
  }
  if (diffHrs > 0) {
    return (str += translate(`${diffHrs > 1 ? `hours${ago}` : `hour${ago}`}`, {
      count: diffHrs
    }));
  }
  return (str += translate(`min${ago}`, { count: diffMins }));
};
