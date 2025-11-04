import Base64 from '@utils/Base64';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IServerConfig } from 'src/dtos/server';

const management = axios.create({
  baseURL: 'https://api-license.engenhoagro.com/api/v1/',
  headers: {
    product: 'E-COOPERATIVA',
  },
});

management.interceptors.request.use(
  (value: AxiosRequestConfig): AxiosRequestConfig => {
    // console.log(value);
    return value;
  },
  (error: AxiosError) => {
    // console.error('management.req.err => ', error);
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Network Connect Timeout. Waiting for server connection: ${management.defaults.baseURL}`,
      );
    }
    if (error.code === 'ENOTFOUND') {
      throw new Error(
        `Api Server "${management.defaults.baseURL}" not response!`,
      );
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error(`Api Server "${management.defaults.baseURL}" timeout!`);
    }

    return Promise.reject(error);
  },
);

management.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    // console.log('MANAGEMENT -> ', response);
    return response;
  },
  (error: AxiosError) => {
    // console.log('MANAGEMENT -> ', error);
    // console.log('MANAGEMENT -> ', error.request);
    // console.log('MANAGEMENT -> ', error.response);
    if (error.message === 'Network Error') {
      throw new Error(
        `Api Server "${management.defaults.baseURL}" not response!`,
      );
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Network Connect Timeout. Waiting for server connection: ${management.defaults.baseURL}`,
      );
    }
    if (error.code === 'ENOTFOUND') {
      throw new Error(
        `Api Server "${management.defaults.baseURL}" not response!`,
      );
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error(`Api Server "${management.defaults.baseURL}" timeout!`);
    }
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message);
    }

    return Promise.reject(error);
  },
);

const getServers = async (cpf: string) => {
  return await management.get<Array<IServerConfig>>(
    `discovery/server/${Base64.encode(cpf)}/list`,
  );
};

export default getServers;
