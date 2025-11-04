import React from 'react';
import Modal from 'react-native-modal';
import {
  ModalContainer,
  ModalTitle,
  InputContainer,
  ModalButtonContainer,
} from './styles';
import Button from '@components/Button';

interface ModalFinalizeWithdrawalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

export function ModalFinalizeWithdrawal({
  isVisible,
  onClose,
  onConfirm,
  children,
}: ModalFinalizeWithdrawalProps) {
  return (
    <Modal
      isVisible={isVisible}
      backdropColor="#3b3b3b"
      backdropOpacity={0.9}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      shouldRasterizeIOS>
      <ModalContainer>
        <ModalTitle>Finalizar Retirada</ModalTitle>
        <InputContainer>{children}</InputContainer>
        <ModalButtonContainer>
          <Button
            type="outline"
            loading={false}
            size="small"
            onPress={onClose}
            style={{marginRight: 10}}>
            back
          </Button>
          <Button size="small" loading={false} onPress={onConfirm}>
            confirm
          </Button>
        </ModalButtonContainer>
      </ModalContainer>
    </Modal>
  );
}
