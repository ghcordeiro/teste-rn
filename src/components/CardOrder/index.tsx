import Colors from '@colors';
import { Row, TextLight, TextRegular } from '@globalStyle';
import convertAfterDot from '@utils/convertAfterDot';
import convertData from '@utils/convertData';
import React from 'react';
import ProgressBar from 'src/shared/components/ProgressBar';
import { IOrder } from '../../dtos/order';

import { Body, BodyGroupText, Container, Header } from './styles';

interface ICardOrder {
  data: IOrder;
}

const CardOrder = ({ data }: ICardOrder) => {
  return (
    <>
      <Container key={data._id}>
        <Header>
          <TextLight
            size={16}
            color={Colors.white}
          >{`Pedido ${data.code}`}</TextLight>
          {data.expirationDate && (
            <TextLight size={16} color={Colors.white}>
              {convertData(
                new Date(data.expirationDate).getTime(),
                '/',
                false,
                'full',
              )}
            </TextLight>
          )}
        </Header>
        <Body>
          <Row justifyContent="space-between">
            <BodyGroupText>
              <TextRegular size={12}>Ano Safra</TextRegular>
              <TextRegular
                size={14}
                textAlign="center"
                numberOfLines={2}
              >{`${data.crop}`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={12}>Pedido</TextRegular>
              <TextRegular size={14}>{`${convertAfterDot(data.quantity, 2)} ${
                data.product.measurementUnit
              }`}</TextRegular>
            </BodyGroupText>
          </Row>
          <Row justifyContent="space-between">
            <BodyGroupText>
              <TextRegular size={12}>Retirado</TextRegular>
              <TextRegular size={14}>{`${convertAfterDot(
                data.quantity - data.balanceQuantity,
                2,
              )} ${data.product.measurementUnit}`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={12}>Saldo</TextRegular>
              <TextRegular size={14}>{`${convertAfterDot(
                data.balanceQuantity,
                2,
              )} ${data.product.measurementUnit}`}</TextRegular>
            </BodyGroupText>
          </Row>
        </Body>
        {/* <View
          style={{
            width: '100%',
            height: 25
          }}>
          <ProgressBar
            width={
              ((data.quantity - data.balanceQuantity) * 100) / data.quantity
            }
          />
          <TextBold
            size={16}
            color={
              ((data.quantity - data.balanceQuantity) * 100) / data.quantity <
              66.66
                ? Colors.dark
                : Colors.white
            }
            style={{
              // position: 'absolute',
              // left: width / 2 - 28,
              // marginTop: 2
              textAlign: 'center',
              zIndex: 1000
            }}>
            {(
              ((data.quantity - data.balanceQuantity) * 100) /
              data.quantity
            ).toFixed(2)}
            %
          </TextBold>
        </View> */}
        <ProgressBar
          value={((data.quantity - data.balanceQuantity) * 100) / data.quantity}
        />
      </Container>
    </>
  );
};

export default CardOrder;
