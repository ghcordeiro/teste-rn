/* eslint-disable react/jsx-props-no-spreading */
import { TextRegular } from '@globalStyle';
import { buttonSize } from '@size';
import { useTranslation } from '@translate/hooks';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RectButtonProperties } from 'react-native-gesture-handler';
import Colors from '../../assets/colors';
import {
  Container,
  ContainerIconText,
  ContainerIndicator,
  Icon
} from './styles';

interface ButtonProps extends RectButtonProperties {
  children: string;
  loading: boolean;
  size?: 'extraSmall' | 'small' | 'normal' | 'large';
  type?: 'normal' | 'outline';
  icon?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  size = 'normal',
  type = 'normal',
  icon,
  ...rest
}) => {
  const { t } = useTranslation();
  
  return (
    <>
      <Container size={size} type={type} {...rest}>
        <ContainerIconText>
          {icon && (
            <Icon
              name={icon}
              size={20}
              color={type === 'outline' ? Colors.ecoop.primary : Colors.white}
            />
          )}
          <TextRegular
            size={buttonSize[size || 'normal']?.font || 18}
            color={type === 'normal' ? Colors.white : Colors.ecoop.primary}>
            {t(children)}
          </TextRegular>
        </ContainerIconText>
        {loading ? (
          <ContainerIndicator {...rest}>
            <ActivityIndicator
              collapsable={false}
              size="large"
              color={type === 'normal' ? Colors.white : Colors.ecoop.primary}
            />
          </ContainerIndicator>
        ) : null}
      </Container>
    </>
  );
};

export default Button;
