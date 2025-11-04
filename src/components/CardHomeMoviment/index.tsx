import React from 'react';

import Colors from '@colors';
import { TextLight } from '@globalStyle';
import { useNavigation } from '@react-navigation/core';
import convertCurrency from '@utils/convertCurrency';
import convertDiaMesAno from '@utils/convertDiaMesAno';
import { IFinancialStatementProps } from '../../dtos/financialStatement';

import {
  Container,
  ContainerRows,
  HeaderContainer,
  RowCard,
  TextData,
  TextLightHome,
  TextRegularHome
} from './styles';

interface ICardHomeProps {
  title: string;
  data: Array<IFinancialStatementProps>;
  route: string;
}

const CardHomeMoviment = ({ data, title, route }: ICardHomeProps) => {
  const navigation = useNavigation();

  const goNavigation = () => {
    if (route !== '') {
      navigation.navigate(route);
    }
  };
  return (
    <>
      <Container onPress={goNavigation}>
        <HeaderContainer>
          <TextLight
            numberOfLines={1}
            adjustsFontSizeToFit
            size={19}
            color={Colors.white}>
            {title}
          </TextLight>
        </HeaderContainer>
        <ContainerRows>
          {data &&
            data.map((d, index) => (
              <RowCard key={Math.random()} index={index}>
                <TextData textAlign="center" size={14}>
                  {convertDiaMesAno(d.dateOf, 'daymonthyear')}
                </TextData>
                <TextLightHome
                  textAlign="left"
                  numberOfLines={3}
                  marginLeft={6}
                  size={14}>{`${d.description}`}</TextLightHome>
                <TextRegularHome
                  textAlign="right"
                  size={14}
                  color={
                    d.operation === 'CREDIT'
                      ? Colors.success.success_1
                      : Colors.danger.danger_1
                  }>
                  {convertCurrency(d.amount, d.currency)}
                </TextRegularHome>
              </RowCard>
            ))}
        </ContainerRows>
      </Container>
    </>
  );
};

export default CardHomeMoviment;
