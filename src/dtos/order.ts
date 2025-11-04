import { IProduct } from './product';
import BaseModel from './base-model';
import ICooperative from './cooperative';

export interface IOrder extends BaseModel {
  status: string;
  active: boolean;
  cooperative: ICooperative;
  producer: {
    _id: string;
    erpCode: string;
    name: string;
    document: string;
    email: string;
    producerGroup: string;
    createdAt: Date;
    updatedAt: Date;
  };
  producerAddress: {
    active: boolean;
    version: number;
    _id: string;
    erpCode: string;
    description: string;
    zipCode: string;
    sr: string;
    cr: string;
    city: {
      _id: string;
      code: number;
      name: string;
      fu: string;
    };
    producer: {
      _id: string;
      erpCode: string;
      name: string;
      document: string;
      email: string;
      producerGroup: string;
      createdAt: Date;
      updatedAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
  };
  product: IProduct;
  erpCode: string;
  code: string;
  crop: string;
  dateOf: Date;
  currency: string;
  paymentMethod: string;
  paymentTerms: string;
  expirationDate: Date;
  quantity: number;
  balanceQuantity: number;
  price: number;
  amount: number;
}
