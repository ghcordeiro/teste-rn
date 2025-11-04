import BaseModel from './base-model';

export interface IActivePrinciple extends BaseModel {
  description: string;
}

export interface IProduct extends BaseModel {
  active: boolean;
  version: number;
  erpCode: string;
  name: string;
  measurementUnit: string;
  packaging: string;
  productGroup: string;
  culture: string;
  activePrinciple: IActivePrinciple;
}
