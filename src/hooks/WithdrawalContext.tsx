import { ISaveWithdrawalDto } from '@dtos/ISaveWithdrawalDto';
import { IReactProps } from '@globalStyle';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from 'src/hooks/UserContext';
import StorageService from 'src/services/storage';

interface WithdrawalContextData {
  items: ISaveWithdrawalDto[];
  handleAddItem: (item: ISaveWithdrawalDto) => boolean;
  handleRemoveItem: (index: number) => void;
  clearItems: () => void;
}

const Withdrawal = createContext<WithdrawalContextData>(
  {} as WithdrawalContextData
);

const WithdrawalContext = ({ children }: IReactProps) => {
  const [items, setItems] = useState<ISaveWithdrawalDto[]>([]);
  const { user } = useAuth();

  const key = `itemToWithdrawal:${user?.producer.id}`;

  const handleLoadData = async () => {
    const savedItems: ISaveWithdrawalDto[] = await StorageService.getStorage(
      key
    );
    setItems(savedItems || []);
  };

  useEffect(() => {
    handleLoadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToStorage = async (itemsToSave: ISaveWithdrawalDto[]) => {
    const savedItems = await StorageService.getStorage(key);
    if (savedItems) {
      await StorageService.removeStorage(key);
    }
    await StorageService.setStorage(key, itemsToSave);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    handleAddToStorage(newItems);
  };

  const handleAddItem = (item: ISaveWithdrawalDto): boolean => {
    if (items.find((i) => i.product.id === item.product.id)) {
      Alert.alert('', 'Item já adicionado');
      return false;
    }
    const itemsToSave = [...items, item];
    setItems(itemsToSave);
    handleAddToStorage(itemsToSave);
    return true;
  };

  const clearItems = async () => {
    setItems([]);
    await StorageService.removeStorage(key);
  };

  return (
    <Withdrawal.Provider
      value={{
        items,
        handleAddItem,
        handleRemoveItem,
        clearItems
      }}>
      {children}
    </Withdrawal.Provider>
  );
};

function useWithdrawal(): WithdrawalContextData {
  const context = useContext(Withdrawal);

  if (!context) {
    throw new Error('useWithdrawal must be used within an WithdrawalProvider');
  }

  return context;
}

export { WithdrawalContext, useWithdrawal };
