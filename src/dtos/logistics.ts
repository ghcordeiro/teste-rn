import BaseModel from './base-model';

export interface ILogistics extends BaseModel {
  producerName: string;
  placeName: string;
  boardingPlace: string;
  contract: string;
  userResponsible: string;
  crop: string;
  culture: string;
  buyer: string;
  buyerCode: string;
  classificationAvg: number;
  classificationAvgPercentage: number;
  ticketBoarding: number;
  ticketBoardingFinish: number;
  dayTicketBoarding: number;
  dayTicketBoardingFinish: number;
  quantity: number;
  quantityDelivered: number;
  balance: number;
  percentDelivered: number;
  measurementUnit: string;
}

export interface IPositionLogistics {
  measurementUnit: string;
  quantity: number;
  quantityDelivered: number;
  balance: number;
  percentDelivered: number;
}

export interface ITicket extends BaseModel {
  contractDeliveryId: string;
  plate: string;
  document: string;
  step: string;
  timeStep: number;
  timeAll: number;
  quantity: number;
  measurementUnit: string;
}

export interface ITimelineItemDTO {
  sequence: number;
  dateOf: string;
  time: number;
  timelineText: string;
}

export interface IDataDTO {
  _id: string;
  contractDeliveryId: string;
  plate: string;
  document: string;
  step: string;
  timeStep: number;
  timeAll: number;
  quantity: number;
  measurementUnit: string;
  dateOf: string;
  startDate: string;
  carrier: string;
  driver: string;
  classification: Array<any>; // Alterar o tipo conforme necessário
  timeline: ITimelineItemDTO[];
}

export interface IInvoiceItem extends BaseModel {
  contractDeliveryId: string;
  plate: string;
  document: string;
  step: string;
  timeStep: number;
  timeAll: number;
  quantity: number;
  measurementUnit: string;
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
