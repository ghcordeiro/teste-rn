import { getTranslations, hasTranslation } from '@translate';
import { useTranslation } from '@translate/hooks';
import React from 'react';
import { BaseTextProps } from '../../types/types';
import { StyledText } from './styles';

export type TextLightProps = BaseTextProps;

/**
 * Componente TextLight com suporte automático a tradução
 *
 * Mesma lógica do TextRegular, mas com fonte light
 */
export const TextLight: React.FC<TextLightProps> = ({
  translationKey,
  params,
  children,
  skipTranslation = false,
  ...textProps
}) => {
  const { t } = useTranslation();

  const getText = (): React.ReactNode => {
    if (skipTranslation) {
      return children;
    }

    if (translationKey) {
      return params ? t(translationKey, params) : t(translationKey);
    }

    if (typeof children === 'string' && children.trim()) {
      const trimmedChildren = children.trim();

      // Primeiro verifica se é uma chave válida diretamente
      if (hasTranslation(trimmedChildren)) {
        return t(trimmedChildren);
      }

      // Tenta encontrar a chave pelo valor traduzido (reverse lookup)
      const translations = getTranslations();
      if (translations) {
        const foundKey = Object.keys(translations).find(
          key => translations[key] === trimmedChildren,
        );
        if (foundKey) {
          return t(foundKey);
        }
      }
    }

    return children;
  };

  return (
    <StyledText
      {...textProps}
      numberOfLines={textProps.numberOfLines}
      adjustsFontSizeToFit={textProps.adjustsFontSizeToFit}
    >
      {getText()}
    </StyledText>
  );
};

export default TextLight;
