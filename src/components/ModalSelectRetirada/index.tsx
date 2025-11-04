/* eslint-disable no-underscore-dangle */
// import Button from '@components/Button';
import Colors from '@colors';
import { Row, TextBold, TextRegular } from '@globalStyle';
import { useNavigation } from '@react-navigation/core';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState
} from 'react';
import Modal from 'react-native-modal';
import { useAuth } from 'src/hooks/UserContext';
import { Button, Container } from './styles';

export interface IModalSelectRetiradaProps {
  openModal: () => void;
  closeModal: () => void;
}

const ModalSelectRetirada: React.ForwardRefRenderFunction<
  IModalSelectRetiradaProps,
  any
> = (_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const navigation = useNavigation();
  const auth = useAuth();

  const openModal = useCallback(async () => {
    setVisible(true);
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

  const handleNova = () => {
    closeModal();
    navigation.navigate('NewWithdrawal');
  };

  const handleAcompanhar = () => {
    closeModal();
    navigation.navigate('TrackWithdrawal');
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
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      shouldRasterizeIOS>
      <Container>
        <Row alignItems="center">
          <TextBold size={17}>Selecione uma opção</TextBold>
        </Row>
        {/* <Button
          size="normal"
          loading={false}
          onPress={() => {
            console.warn('aaaaaaa');
            handleNova();
          }}>
          Nova retirada
        </Button>
        <Button
          size="normal"
          loading={false}
          onPress={() => handleAcompanhar()}>
          Acompanhar retirada
        </Button> */}
        {auth.user?.permissions.find((f) => f === 'APP:STOCKWITHDRAWAL') ? (
          <Button onPress={handleNova}>
            <TextRegular size={18} color={Colors.white}>
              Nova retirada
            </TextRegular>
          </Button>
        ) : (
          <></>
        )}
        {auth.user?.permissions.find((f) => f === 'APP:DELIVERYTRACKING') ? (
          <Button onPress={handleAcompanhar}>
            <TextRegular size={18} color={Colors.white}>
              Acompanhar retirada
            </TextRegular>
          </Button>
        ) : (
          <></>
        )}
      </Container>
    </Modal>
  );
};

export default forwardRef(ModalSelectRetirada);
