import {useNavigation} from '@react-navigation/core';
import React, {PropsWithChildren} from 'react';
import {TextRegular} from '@globalStyle';

import {Container} from './styles';

interface ICardHeaderProps extends PropsWithChildren {
  title: string;
  route: string;
}

const CardHeader = ({title, route, ...rest}: ICardHeaderProps) => {
  const navigation = useNavigation();
  const goNavigation = () => {
    navigation.navigate(route);
  };
  return (
    <Container onPress={goNavigation}>
      <TextRegular size={12}>{title}</TextRegular>
    </Container>
  );
};

export default CardHeader;
