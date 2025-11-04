import { translate } from '@translate';
import Toast from './toast';

export default (status: number, error?: any, time?: number) => {
  const duration = time || 3500;
  if (status === -1) {
    return Toast.show(error, { duration });
  }
  if (status === 0 && error) {
    const stat = error.message.substr(error.message.indexOf('code') + 5, 3);
    status = Number(stat);
  }
  if (status === 400) {
    return Toast.show(error, { duration });
  }
  if (status === 401) {
    return Toast.show(translate('errorUnauthorized'), { duration });
  }
  if (status === 403) {
    return Toast.show(translate('errorForbidden'), { duration });
  }
  if (status > 400 && status < 500) {
    return Toast.show(translate('errorUnexpected'), { duration });
  }
  return Toast.show(translate('errorServer'), { duration });
};
