import BaseModel from './base-model';

export interface IContract extends BaseModel {
  orderContract: number;
  modalTypeCode: string;
  modalType: string;
  contract: string;
  crop: string;
  status: string;
  culture: string;
  expirationDate: Date;
  buyerCode: string;
  buyer: string;
  quantity: number;
  quantityDelivered: number;
  balance: number;
  percentDelivered: number;
  measurementUnit: string;
  producerDocument: string;
  producerErpCode: string;
  producerId: string;
  producerName: string;
  paymentDate: Date;
  contractPrice: number;
  currency: string;
  amount: number;
  issueDate: Date;
}

export interface IPositionContract {
  measurementUnit: string;
  quantity: number;
  quantityDelivered: number;
  balance: number;
  percentDelivered: number;
}

export interface IInvoice extends BaseModel {
  contractId: string;
  invoice: string;
  type: EContractType;
  dateOf: Date;
  amount: number;
  currency: string;
  paymentMethod: string;
  document: string;
  paymentDate: Date;
}

export interface IInvoiceItem extends BaseModel {
  expirationDate: Date;
  paymentTerm: string;
  priceType: string;
  price: number;
  alternativeCurrency: string;
  ptax: number;
  contractId: string;
  invoice: string;
  type: EContractType;
  dateOf: Date;
  amount: number;
  currency: string;
}

export enum EContractType {
  RECEIVEMENT = 'RECEIVEMENT',
  EXPEDITION = 'EXPEDITION',
  SHIPPING = 'SHIPPING',
  DEVOLUTION = 'DEVOLUTION',
  PAYMENT = 'PAYMENT'
}

export interface IPayment extends BaseModel {
  contractId: string;
  invoice: string;
  document: number;
  type: string;
  paymentMethod: string;
  dateOf: Date;
  paymentDate: Date;
  amount: number;
  currency: string;
}

export interface IPaymentItem extends BaseModel {
  invoice: string;
  document: number;
  type: string;
  dateOf: Date;
  paymentDate: Date;
  paymentTerm: string;
  paymentMethod: string;
  description: string;
  priceType: string;
  price: number;
  amount: number;
  currency: string;
  alternativeCurrency: string;
  ptax: number;
  contractId: string;
}

export interface IAdvance extends BaseModel {
  contractId: string;
  document: number;
  type: string;
  dateOf: Date;
  paymentDate: Date;
  amount: number;
  currency: string;
}

export interface IAdvanceItem extends BaseModel {
  document: number;
  type: string;
  dateOf: Date;
  paymentDate: Date;
  paymentTerm: string;
  paymentMethod: string;
  description: string;
  amount: number;
  currency: string;
  alternativeCurrency: string;
  ptax: number;
  contractId: string;
}

export interface INote {
  note: string;
}
