import Colors from '@colors';
import { Row, TextLight, TextRegular } from '@globalStyle';
import { useNavigation } from '@react-navigation/native';
import convertAfterDot from '@utils/convertAfterDot';
import React from 'react';
import { ProgressBar } from 'src/shared';
import { ILogistics } from '../../types/logistics';

import { Body, BodyGroupText, Container, Header } from './styles';

interface ICardLogistics {
  data: ILogistics;
}

const CardLogistics = ({ data }: ICardLogistics) => {
  const navigation = useNavigation();

  const handleNavigate = () => {
    navigation.navigate('LogisticsDetails', { id: data._id });
  };

  return (
    <>
      <Container key={data._id} onPress={handleNavigate}>
        <Header>
          <TextLight
            size={16}
            numberOfLines={1}
            color={Colors.white}
          >{`${data.placeName}`}</TextLight>
        </Header>
        <Body>
          <Row justifyContent="space-between">
            <BodyGroupText>
              <TextRegular size={15} marginBottom={12} numberOfLines={1}>
                {data.contract} - {data.buyerCode}
              </TextRegular>
            </BodyGroupText>
          </Row>
          <Row justifyContent="center">
            <BodyGroupText>
              <TextRegular size={10}>Embarcados</TextRegular>
              <TextRegular size={12}>{`${
                convertAfterDot(data.ticketBoarding, 0) || 0
              }`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={10}>Finalizados</TextRegular>
              <TextRegular size={12}>{`${
                convertAfterDot(data.ticketBoardingFinish, 0) || 0
              }`}</TextRegular>
            </BodyGroupText>
          </Row>
          <Row justifyContent="center">
            <BodyGroupText>
              <TextRegular size={10}>Embarcados Hoje</TextRegular>
              <TextRegular size={12}>{`${
                convertAfterDot(data.dayTicketBoarding, 0) || 0
              }`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={10}>Finalizados Hoje</TextRegular>
              <TextRegular size={12}>{`${
                convertAfterDot(data.dayTicketBoardingFinish, 0) || 0
              }`}</TextRegular>
            </BodyGroupText>
          </Row>
          <Row justifyContent="space-between">
            <BodyGroupText>
              <TextRegular size={12} translationKey="contracted" />
              <TextRegular size={15}>{`${convertAfterDot(data.quantity, 2)} ${
                data.measurementUnit
              }`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={12} translationKey="shipped" />
              <TextRegular size={15}>{`${convertAfterDot(
                data.quantityDelivered,
                2,
              )} ${data.measurementUnit}`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={12} translationKey="balance" />
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

export default CardLogistics;
