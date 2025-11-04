/* eslint-disable no-underscore-dangle */
import Colors from '@colors';
// import Button from '@components/Button';
import InputMask, { InputRef } from '@components/InputMask';
import { LabelValue } from '@components/LabelValue';
import IWithdrawal from '@dtos/withdrawal';
import { TextRegular } from '@globalStyle';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { Alert } from 'react-native';
import Modal from 'react-native-modal';
import { useAuth } from 'src/hooks/UserContext';
import { useWithdrawal } from 'src/hooks/WithdrawalContext';
import {
  Button,
  Container,
  InputWrapper,
  LabelValueWrapper,
  ModalContainer
} from './styles';

export interface IModalSelectItemsToWithdrawalProps {
  openModal: (item: IWithdrawal) => void;
  closeModal: () => void;
}

const ModalSelectItemsToWithdrawal: React.ForwardRefRenderFunction<
  IModalSelectItemsToWithdrawalProps,
  any
> = (_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const { user } = useAuth();
  const { handleAddItem } = useWithdrawal();
  const [item, setItem] = useState<IWithdrawal>({} as IWithdrawal);
  const [textValue] = useState<any>();
  const [precision, setPrecision] = useState(2);
  const inputRef = useRef<InputRef>(null);

  const openModal = useCallback(async (value: IWithdrawal) => {
    setVisible(true);
    setItem(value);
    setPrecision(value.withdrawalBalance % 1 !== 0 ? 2 : 0);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    };
  });

  const handleAddItemToContext = () => {
    const quantity = inputRef.current?.value() ? 
      Number(inputRef.current?.value().replace('.', '').replace(',', '.')) : 
      null //inputRef.current?.getRawValue() as number;
    if (!quantity){
      inputRef.current?.isError(true);
      Alert.alert(
        'Erro',
        'A quantidade deve ser informada!'
      );
      return;
    }
    if (
      quantity &&
      item.withdrawalBalance >= quantity
    ) {
      if (
        handleAddItem({
          crop: item.crop,
          producer: user?.producer || ({} as { id: string; name: string }),
          product: {
            id: item.productId,
            name: item.name,
            measurementUnit: item.measurementUnit
          },
          quantity: quantity
        })
      ) {
        closeModal();
      }
    } else {
      inputRef.current?.isError(true);
      Alert.alert(
        'Erro',
        'A quantidade deve ser menor ou igual ao saldo disponível'
      );
    }
  };

  return (
    <Modal
      isVisible={visible}
      backdropColor="#3b3b3b"
      backdropOpacity={0.9}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      // onBackButtonPress={closeModal}
      // onBackdropPress={closeModal}
      shouldRasterizeIOS>
      <ModalContainer>
        <Container>
          <LabelValueWrapper>
            <LabelValue label="Item" value={item.name} fontSize={14} />
          </LabelValueWrapper>
          { item.crop && 
            <LabelValueWrapper>
              <LabelValue label="Safra" value={item.crop} fontSize={14} />
            </LabelValueWrapper>
          }
          <LabelValueWrapper>
            <LabelValue
              label="Em estoque/Disponível para retirada"
              value={`${item.balance} ${item.measurementUnit}/${item.withdrawalBalance} ${item.measurementUnit}`}
              fontSize={14}
            />
          </LabelValueWrapper>
          <InputWrapper>
            <InputMask
              type={"money"}
              options={{
                precision: precision,
                separator: ',',
                delimiter: '.',
                unit: '',
              }}
              ref={inputRef}
              placeholder="Digite a quantidade"
              value={textValue}
              // style={{
              //   fontSize: 12,
              //   width: 100,
              //   height: 100
              // }}
            />
          </InputWrapper>
          {/* <Button
            size="normal"
            loading={false}
            onPress={handleAddItemToContext}>
            confirm
          </Button> */}
          <Button onPress={handleAddItemToContext}>
            <TextRegular size={18} color={Colors.white}>
              Confirmar
            </TextRegular>
          </Button>
          <Button onPress={closeModal}>
            <TextRegular size={18} color={Colors.white}>
              Cancelar
            </TextRegular>
          </Button>
          {/* <Button size="normal" loading={false} onPress={closeModal}>
            cancel
          </Button> */}
          {/* input para digitar a quantidade e validar com a qtd disponivel pro item */}
        </Container>
      </ModalContainer>
    </Modal>
  );
};

export default forwardRef(ModalSelectItemsToWithdrawal);
