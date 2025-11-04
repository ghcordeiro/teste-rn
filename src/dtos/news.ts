import { ENewsType } from '../enum/ENewsType';
import BaseModel from './base-model';

export interface INews extends BaseModel {
  title: string;
  message: string;
  type: ENewsType;
  filesId?: string;
}
