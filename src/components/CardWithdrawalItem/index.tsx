import Colors from '@colors';
import ModalSelectItemsToWithdrawal from '@components/ModalSelectItemsToWithdrawal';
import { Row, StyledView, TextBold, TextRegular } from '@globalStyle';
import React from 'react';
import { IProductDeliveryOrder } from '../../dtos/delivery-order';
import { Body, Container, Header } from './styles';

interface ICardWithdrawalItemProps {
  data: IProductDeliveryOrder;
}

export function CardWithdrawalItem({ data }: ICardWithdrawalItemProps) {
  return (
    <>
      <Container>
        <Header>
          <TextBold size={13} numberOfLines={1} color={Colors.white}>
            {data.productName}
          </TextBold>
        </Header>
        <Body>
          <Row alignItems="center" justifyContent="space-between">
            <StyledView flex={4} justifyContent="center" height="100%">
              { data.crop &&
                <StyledView height="50%" justifyContent="flex-start">
                  <TextRegular size={14}>Safra: {data.crop}</TextRegular>
                </StyledView>
              }
              <StyledView height="50%" justifyContent="flex-end">
                <TextRegular size={14}>
                  Quantidade solicitada: {data.quantity}
                  {/* {data?.measurementUnit} */}
                </TextRegular>
              </StyledView>
            </StyledView>
          </Row>
        </Body>
      </Container>
      <ModalSelectItemsToWithdrawal />
    </>
  );
}
