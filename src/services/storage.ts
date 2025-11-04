import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastError from '../utils/ToastError';

const StorageService = {
  async setStorage(key: string, value: any) {
    try {
      await AsyncStorage.setItem(`@ECooperativa:${key}`, JSON.stringify(value));
      console.log(key, value)
      console.log(value.servers)
    } catch (e: any) {
      ToastError(e);
      throw e;
    }
  },

  async getStorage(key: string) {
    try {
      const dado = await AsyncStorage.getItem(`@ECooperativa:${key}`);
      return dado !== null && dado.length > 0 ? JSON.parse(dado) : null;
    } catch (e: any) {
      ToastError(e);
      throw e;
    }
  },

  async removeStorage(key: string) {
    try {
      await AsyncStorage.removeItem(`@ECooperativa:${key}`);
    } catch (e: any) {
      ToastError(e);
      throw e;
    }
  },

  async multiGet(keys: Array<string>) {
    try {
      const newKeys = keys.map((k) => `@ECooperativa:${k}`);
      return await AsyncStorage.multiGet(newKeys);
    } catch (e: any) {
      ToastError(e);
      throw e;
    }
  }
};

export default StorageService;
