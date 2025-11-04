import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  getBrand,
  getDeviceId,
  getModel,
  getSystemName,
  getSystemVersion,
  getUniqueId,
  isEmulator,
} from 'react-native-device-info';
import { navigate } from './navigation';
import StorageService from './storage';

const api = axios.create();

api.interceptors.request.use(
  async (value: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    value.headers = {
      ...value.headers,
      'device-unique-id': await getUniqueId(), //ID único do dispositivo (pode ser o Android ID, IDFV, etc.)
      'device-brand-name': getBrand(), //Marca do dispositivo (Apple, Samsung, Xiaomi, etc.)
      'device-model-name': getModel(), //Modelo do dispositivo (iPhone 13, Galaxy S22, etc.)
      'device-system-name': getSystemName(), //Nome do sistema operacional (iOS, Android)
      'device-system-version': getSystemVersion(), //Versão do SO (17.2, 13, etc.)
      'device-model-version': getDeviceId(), //ID interno do modelo (iPhone14,2, SM-G991B, etc.)
      'device-is-emulator': String(isEmulator()), //Se é um emulador
    };
    console.log(`Request => ${value.baseURL}${value.url}`);
    // console.log(value.headers);
    return value;
  },
  error => {
    console.error('api.req.err => ', error);
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Network Connect Timeout. Waiting for server connection: ${api.defaults.baseURL}`,
      );
    }
    if (error.code === 'ENOTFOUND') {
      throw new Error(`Api Server "${api.defaults.baseURL}" not response!`);
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error(`Api Server "${api.defaults.baseURL}" timeout!`);
    }

    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  async (response: AxiosResponse<any>) => {
    console.log(`Response => ${response.config.baseURL}${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    // console.log(error.response?.data);
    if (error.message === 'Network Error') {
      throw new Error(`Api Server "${api.defaults.baseURL}" not response!`);
    }
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Network Connect Timeout. Waiting for server connection: ${api.defaults.baseURL}`,
      );
    }
    if (error.code === 'ENOTFOUND') {
      throw new Error(`Api Server "${api.defaults.baseURL}" not response!`);
    }

    if (error.code === 'ETIMEDOUT') {
      throw new Error(`Api Server "${api.defaults.baseURL}" timeout!`);
    }
    if (error.response && error.response.status === 400) {
      throw new Error(error.response.data.message);
    }
    if (error.response && error.response.status === 401) {
      if (error.response.data.message === 'Unauthorized') {
        api.defaults.headers = {};
        StorageService.removeStorage('user');
        navigate('LoginCPF');
      } else {
        throw error.response.data.message;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
