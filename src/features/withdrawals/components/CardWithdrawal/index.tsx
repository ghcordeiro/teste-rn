import Colors from '@colors';
import ModalSelectItemsToWithdrawal, {
  IModalSelectItemsToWithdrawalProps
} from '@components/ModalSelectItemsToWithdrawal';
import { Row, TextLight, TextRegular } from '@globalStyle';
import convertAfterDot from '@utils/convertAfterDot';
import React, { useRef } from 'react';
import IWithdrawalProps from '../../types/withdrawal';

import { Body, BodyGroupText, Container, Header } from './styles';

interface ICardWithdrawal {
  data: IWithdrawalProps;
}

const CardWithdrawal = ({ data }: ICardWithdrawal) => {
  const modalRef = useRef<IModalSelectItemsToWithdrawalProps>(null);

  const handleOpenModal = () => {
    modalRef.current?.openModal(data);
  };

  return (
    <>
      <Container key={data.productId.toString()} onPress={handleOpenModal}>
        <Header>
          <TextLight
            numberOfLines={1}
            adjustsFontSizeToFit
            size={18}
            color={Colors.white}>
            {data.name}
          </TextLight>
        </Header>
        <Body>
          { data.crop && 
            <Row justifyContent="space-between">
              <BodyGroupText>
                <TextRegular size={15} marginBottom={12} numberOfLines={1}>
                  {data.crop}
                </TextRegular>
              </BodyGroupText>
            </Row>
          }
          <Row justifyContent="space-between">
            <BodyGroupText>
              <TextRegular size={12}>Estoque</TextRegular>
              <TextRegular size={15}>{`${convertAfterDot(data.balance, 2)} ${
                data.measurementUnit
              }`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={12}>Estoque Disponível</TextRegular>
              <TextRegular size={15}>{`${convertAfterDot(
                data.withdrawalBalance || 0,
                2
              )} ${data.measurementUnit}`}</TextRegular>
            </BodyGroupText>
          </Row>
        </Body>
      </Container>
      <ModalSelectItemsToWithdrawal ref={modalRef} />
    </>
  );
};

export default CardWithdrawal;
