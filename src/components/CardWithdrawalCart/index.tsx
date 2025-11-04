import Colors from '@colors';
import { IconWithCount } from '@components/IconWithCount';
import ModalSelectItemsToWithdrawal from '@components/ModalSelectItemsToWithdrawal';
import { ISaveWithdrawalDto } from '@dtos/ISaveWithdrawalDto';
import { Row, StyledView, TextBold, TextRegular } from '@globalStyle';
import React from 'react';
import { useWithdrawal } from 'src/hooks/WithdrawalContext';
import { Body, Container, Header } from './styles';

interface ICardWithdrawalCartProps {
  data: ISaveWithdrawalDto;
  index: number;
}

export function CardWithdrawalCart({ data, index }: ICardWithdrawalCartProps) {
  const { handleRemoveItem } = useWithdrawal();

  const handleRemove = () => {
    handleRemoveItem(index);
  };
  return (
    <>
      <Container>
        <Header>
          <TextBold size={13} numberOfLines={1} color={Colors.white}>
            {data.product.name}
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
                  Quantidade solicitada: {data.quantity}{' '}
                  {data.product.measurementUnit}
                </TextRegular>
              </StyledView>
            </StyledView>
            <StyledView alignItems="center" justifyContent="center" flex={1}>
              <IconWithCount
                action={handleRemove}
                count={0}
                icon="trash"
                color={Colors.ecoop.primary}
              />
            </StyledView>
          </Row>
        </Body>
      </Container>
      <ModalSelectItemsToWithdrawal />
    </>
  );
}
