import { EDeliveryOrderStatus } from '@enum/EDeliveryOrderStatus';

export interface IAttachmentDeliveryOrder {
  fileName: string;
  mimetype: string;
  createdAt: Date;
  attachmentId: string;
}

export interface IProductDeliveryOrder {
  deliveryOrderId: string;
  productId: string;
  productName: string;
  crop: string;
  quantity: number;
  quantitySaved: number;
}

export interface IDeliveryOrder {
  key: string;
  deliveryCode: string;
  producerId: string;
  producerName: string;
  addressDeliveryId?: string;
  addressDeliveryPlaceName?: string;
  addressDelivery?: string;
  vehiclePlate?: string;
  status: EDeliveryOrderStatus;
  dateOf: Date | string;
  createdAt: Date | string;
  dateStatus: Date;
  code: string;
  note: string;
  orderCode: Array<string>;
  invoiceCode: Array<string>;
  products: Array<IProductDeliveryOrder>;
  attachments: Array<IAttachmentDeliveryOrder>;
}
