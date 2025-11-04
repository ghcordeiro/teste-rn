import { endOfDay, startOfDay } from 'date-fns';

export default (datas: Date[]): void => {
  if (datas && datas.length > 0 && datas[0]) {
    datas[0] = startOfDay(datas[0]);
  }
  if (datas && datas.length > 1 && datas[1]) {
    datas[1] = endOfDay(datas[1]);
  }
};
