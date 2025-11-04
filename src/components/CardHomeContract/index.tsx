import React from 'react';

import { Row, TextLight } from '@globalStyle';
import Colors from '@colors';
import convertDiaMesAno from '@utils/convertDiaMesAno';

import IResumoContractProps from 'src/dtos/resumoContract';
import {
  Container,
  TextData,
  TextLightHome,
  TextRegularHome,
  HeaderContainer,
  ContainerRows
} from './styles';

interface ICardHomeProps {
  title: string;
  data: Array<IResumoContractProps>;
}

const CardHomeContract = ({ data, title }: ICardHomeProps) => {
  return (
    <>
      <Container>
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
              <Row
                key={Math.random()}
                justifyContent="space-between"
                alignItems="center"
                paddingLeft={6}
                paddingRight={2}
                flex={1}
                backgroundColor={index % 2 === 0 ? '#F0f0f0' : undefined}>
                <TextData textAlign="center" size={14}>
                  {convertDiaMesAno(d.expirationDate, 'monthyear')}
                </TextData>
                <TextLightHome
                  textAlign="left"
                  numberOfLines={3}
                  marginLeft={
                    6
                  }>{`  ${d.modalType} - ${d.contract} - ${d.culture}`}</TextLightHome>
                <TextRegularHome
                  textAlign="right"
                  size={
                    15
                  }>{`${d.quantity} ${d.measurementUnit}`}</TextRegularHome>
              </Row>
            ))}
        </ContainerRows>
      </Container>
    </>
  );
};

export default CardHomeContract;
