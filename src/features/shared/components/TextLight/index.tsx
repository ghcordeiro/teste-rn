import { hasTranslation } from '@translate';
import { useTranslation } from '@translate/hooks';
import React from 'react';
import { ITextProps } from '../../../../../assets/styles';
import { StyledText } from './styles';

export interface TextLightProps extends ITextProps {
  translationKey?: string;
  params?: Record<string, string | number>;
  children?: React.ReactNode;
  skipTranslation?: boolean;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
}

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
      
      if (hasTranslation(trimmedChildren)) {
        return t(trimmedChildren);
      }
    }

    return children;
  };

  return (
    <StyledText {...textProps} numberOfLines={textProps.numberOfLines} adjustsFontSizeToFit={textProps.adjustsFontSizeToFit}>
      {getText()}
    </StyledText>
  );
};

export default TextLight;

