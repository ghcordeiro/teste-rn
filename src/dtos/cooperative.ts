import BaseModel from './base-model';

export default interface ICooperative extends BaseModel {
  active: boolean;
  version: number;
  erpCode: number;
  name: string;
  document: string;
  email: string;
  code: number;
  address: {
    _id: string;
    code: number;
    description: string;
    city: {
      _id: string;
      code: string;
      name: string;
      fu: string;
    };
  };
}
