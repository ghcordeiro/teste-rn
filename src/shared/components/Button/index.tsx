import Colors from '@colors';
import { buttonSize } from '@size';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { RectButtonProperties } from 'react-native-gesture-handler';
import { TextRegular } from 'src/shared/components/TextRegular';
import {
  Container,
  ContainerIconText,
  ContainerIndicator,
  Icon,
} from './styles';

interface ButtonProps extends RectButtonProperties {
  children: React.ReactNode;
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
  // Se children for string, sempre passa como translationKey
  // O TextRegular irá verificar se é uma chave válida e traduzir automaticamente
  // Se não for chave válida, o TextRegular retornará a string original
  const translationKey =
    typeof children === 'string' ? children.trim() : undefined;

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
            color={type === 'normal' ? Colors.white : Colors.ecoop.primary}
            translationKey={translationKey}
          >
            {children}
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
