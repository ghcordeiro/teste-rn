export interface ISaveWithdrawalDto {
  producer: {
    id: string;
    name: string;
  };
  product: {
    id: string;
    name: string;
    measurementUnit: string;
  };
  crop: string;
  quantity: number;
}
