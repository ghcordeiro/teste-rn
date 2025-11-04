import { IconWithCount } from '@components/IconWithCount';
import { ModalFinalizeWithdrawal } from '@components/ModalFinalizeWithdrawal';
import { FlatListBottomSpace, TextRegular } from '@globalStyle';
import { useNavigation } from '@react-navigation/core';
import { useTranslation } from '@translate/hooks';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { useWithdrawal } from 'src/hooks/WithdrawalContext';
import api from 'src/services/api';
import { Button, Header, Loading, Select } from 'src/shared';
import { CardWithdrawalCart } from '../../';
import { ISaveWithdrawalDto } from '../../types/ISaveWithdrawalDto';
import {
  ButtonActionContainer,
  ButtonWrapper,
  Container,
  ContainerEmptyComponent,
  FloatingButton,
  InternalButtonActionContainer,
  SelectWrapper,
} from './styles';

interface IOptionAddress {
  farmId?: string;
  farmName: string;
  farmAddress: string;
  farmNameAddress: string;
  producerId?: string;
  producerName?: string;
  producerCode?: string;
  producerDocument?: string;
}

export function WithdrawalCart() {
  const { t } = useTranslation();
  const { items, clearItems } = useWithdrawal();
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [options, setOptions] = useState<any[]>();
  const [address, setAddress] = useState<string | undefined>();
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [sending, setSending] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigateToNewWithdrawal = () => {
    navigation.navigate('NewWithdrawal');
  };

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const response = await api.get('delivery-order/address/list');
      const farms = ((response.data || []) as Array<IOptionAddress>).map(
        doc => ({
          ...doc,
          farmNameAddress: `${doc.farmName ? `${doc.farmName} - ` : ''}${
            doc.farmAddress
          }`,
        }),
      );
      if (farms && farms.length > 1) {
        farms.unshift({
          farmName: '',
          farmAddress: '',
          farmNameAddress: 'Selecione um Endereço para Faturamento',
        });
      }
      setAddress(farms.length > 0 ? farms[0].farmId : undefined);
      setOptions(farms);
    } catch (error) {
      console.error(error);
      setOptions([]);
    }
    setLoadingOptions(false);
  };

  const handleClear = () => {
    Alert.alert(
      'Limpar pedido',
      'Deseja realmente limpar os itens selecionados?',
      [
        { text: 'Cancelar' },
        {
          text: 'Limpar',
          onPress: a => {
            clearItems();
            setAddress(undefined);
          },
        },
      ],
    );
  };

  const renderItem = (item: ISaveWithdrawalDto, index: number) => (
    <>
      <Container>
        <CardWithdrawalCart
          key={`cart-${item.product.id}-${index}`}
          data={item}
          index={index}
        />
        {index === items.length - 1 ? <FlatListBottomSpace /> : null}
      </Container>
    </>
  );

  const renderEmptyComponent = () => (
    <ContainerEmptyComponent>
      <TextRegular size={14}>Nenhum item selecionado</TextRegular>
      <Button
        loading={false}
        size="small"
        onPress={handleNavigateToNewWithdrawal}
      >
        selectItems
      </Button>
    </ContainerEmptyComponent>
  );

  const handleSaveWithdrawal = async () => {
    if (items.length > 0) {
      setModalVisible(true);
    } else {
      Alert.alert(t('withdrawalAtLeastOneItem'));
    }
  };

  const handleConfirmWithdrawal = async () => {
    try {
      setSending(true);
      if (options && options?.length > 0 && !address) {
        Alert.alert(t('withdrawalEnterBillingAddress'));
        setSending(false);
        return;
      }
      if (!vehiclePlate) {
        Alert.alert(t('withdrawalEnterVehiclePlate'));
        setSending(false);
        return;
      }
      const plateRegex = new RegExp(
        '^[A-Z]{3}[0-9][A-Z][0-9]{2}$|^[A-Z]{3}[0-9]{4}',
      );
      if (!plateRegex.test(vehiclePlate.toUpperCase())) {
        Alert.alert(
          t('withdrawalInvalidVehiclePlate'),
          t('withdrawalPlateFormatDescription'),
        );
        setSending(false);
        return;
      }

      const itemsToSave = items.map(i => ({
        producer: i.producer.id,
        product: i.product.id,
        crop: i.crop,
        addressDelivery: address,
        quantity: i.quantity,
        vehiclePlate: vehiclePlate.toUpperCase(),
      }));

      try {
        await api.post('delivery-order/save', itemsToSave);
        Alert.alert(t('withdrawalSavedSuccess'));
        clearItems();
        setAddress(undefined);
        setVehiclePlate('');
        setModalVisible(false);
      } catch (e) {
        console.error(e);
        Alert.alert(t('withdrawalUnexpectedErrorFinishing', {error: String(e)}));
      }
    } catch (error) {
    } finally {
      setSending(false);
    }
  };
  const maskPlate = (value?: string) => {
    let s = (value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '') // mantém só A-Z/0-9
      .slice(0, 7); // placa tem 7 chars

    // Se aparenta Mercosul (LLL D L DD), não usamos hífen
    if (
      /^[A-Z]{3}\d[A-Z]\d{0,2}$/.test(s) ||
      /^[A-Z]{3}\d[A-Z]\d{2}$/.test(s)
    ) {
      return s;
    }

    // Caso “antigo” (LLL DDDD) – insere hífen após as 3 letras
    return s.replace(/^([A-Z]{3})(\d{0,4}).*$/, (_, l3, rest) =>
      rest ? `${l3}${rest}` : l3,
    );
  };
  const onChangeText = (txt: string) => {
    const masked = maskPlate(txt);
    setVehiclePlate(masked);
    // Opcional: garantir cursor no fim (evita “pulos” ao formatar)
    // setSelection({ start: masked.length, end: masked.length });
  };
  return (
    <>
      <Header showBackButton />
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 8,
        }}
      />
      <ScrollView>
        {items?.length > 0
          ? items.map((item, index) => renderItem(item, index))
          : renderEmptyComponent()}
      </ScrollView>
      {sending && <Loading />}

      <ModalFinalizeWithdrawal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmWithdrawal}
      >
        {loadingOptions ? (
          <Loading />
        ) : (
          options &&
          options.length > 0 && (
            <SelectWrapper>
              <Select
                propertyValue="farmId"
                propertyLabel="farmNameAddress"
                defaultValue={address || ''}
                options={options}
                key="SelectAddress"
                name="SelectAddress@withdrwal"
                onActionChange={value => {
                  setAddress(value);
                }}
              />
            </SelectWrapper>
          )
        )}

        <TextInput
          placeholder="Informe a Placa do Veículo para retirada!"
          value={vehiclePlate}
          onChangeText={onChangeText}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
          }}
          autoCapitalize="characters"
          autoCorrect={false}
          keyboardType="default"
        />
      </ModalFinalizeWithdrawal>

      <ButtonActionContainer>
        <FloatingButton onPress={handleNavigateToNewWithdrawal}>
          <IconWithCount
            action={handleNavigateToNewWithdrawal}
            count={0}
            icon="plus"
          />
        </FloatingButton>
        <InternalButtonActionContainer>
          <ButtonWrapper>
            <Button
              size="small"
              type="outline"
              loading={false}
              onPress={handleClear}
            >
              clear
            </Button>
            <Button size="small" loading={false} onPress={handleSaveWithdrawal}>
              end
            </Button>
          </ButtonWrapper>
        </InternalButtonActionContainer>
      </ButtonActionContainer>
    </>
  );
}
