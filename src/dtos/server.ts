export interface IServerConfig {
  _id: string;
  code: string;
  env: string;
  companyCode: string;
  companyCodeTxt?: string;
  companyName: string;
  featuresProduct: Array<string>;
  servers: Array<IServer>;
}

export interface IServer {
  url: string;
  priority: number;
}
