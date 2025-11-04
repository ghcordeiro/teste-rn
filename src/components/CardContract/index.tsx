import Colors from '@colors';
import { Row, TextLight, TextRegular } from '@globalStyle';
import { useNavigation } from '@react-navigation/native';
import convertAfterDot from '@utils/convertAfterDot';
import convertData from '@utils/convertData';
import React from 'react';
import { IContract } from 'src/dtos/contract';
import ProgressBar from '../ProgressBar';

import { Body, BodyGroupText, Container, Header } from './styles';

interface ICardContract {
  data: IContract;
}

const CardContract = ({ data }: ICardContract) => {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate('ContractDetails', { id: data._id });
  };

  return (
    <>
      <Container key={data._id} onPress={handleNavigate}>
        <Header>
          <TextLight
            size={16}
            numberOfLines={1}
            color={
              Colors.white
            }>{`${data.modalType} - ${data.contract} - ${data.culture}`}</TextLight>
          {data.expirationDate && (
            <TextLight size={16} color={Colors.white}>
              {convertData(
                new Date(data.expirationDate).getTime(),
                '/',
                false,
                'full'
              )}
            </TextLight>
          )}
        </Header>
        <Body>
          <Row justifyContent="space-between">
            <BodyGroupText>
              <TextRegular size={15} marginBottom={12} numberOfLines={1}>
                {data.producerName}
              </TextRegular>
            </BodyGroupText>
          </Row>
          <Row justifyContent="space-between">
            <BodyGroupText>
              <TextRegular size={12}>Contratado</TextRegular>
              <TextRegular size={15}>{`${convertAfterDot(data.quantity, 2)} ${
                data.measurementUnit
              }`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={12}>Entregue</TextRegular>
              <TextRegular size={15}>{`${convertAfterDot(
                data.quantityDelivered,
                2
              )} ${data.measurementUnit}`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={12}>Saldo</TextRegular>
              <TextRegular size={15}>{`${convertAfterDot(data.balance, 2)} ${
                data.measurementUnit
              }`}</TextRegular>
            </BodyGroupText>
          </Row>
        </Body>
        <ProgressBar value={data.percentDelivered} />
      </Container>
    </>
  );
};

export default CardContract;
