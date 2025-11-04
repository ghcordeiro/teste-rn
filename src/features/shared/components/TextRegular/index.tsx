import { hasTranslation } from '@translate';
import { useTranslation } from '@translate/hooks';
import React from 'react';
import { ITextProps } from '../../../../../assets/styles';
import { StyledText } from './styles';

export interface TextRegularProps extends ITextProps {
  /**
   * Chave de tradução. Se fornecida, o texto será traduzido automaticamente.
   * Se não fornecida, tentará detectar se children é uma chave válida no i18n.
   */
  translationKey?: string;
  /**
   * Parâmetros para a tradução (ex: { name: "João" })
   */
  params?: Record<string, string | number>;
  /**
   * Conteúdo do texto. Se for string, verifica se é uma chave válida no i18n.
   * Se for objeto/ReactNode, não será traduzido (assumido como dado do backend).
   */
  children?: React.ReactNode;
  /**
   * Força a não traduzir, mesmo que seja uma chave válida. Útil para dados do backend.
   */
  skipTranslation?: boolean;
  /**
   * Props nativas do Text do React Native
   */
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
}

/**
 * Componente TextRegular com suporte automático a tradução
 *
 * Detecta automaticamente se o texto deve ser traduzido:
 * - Se translationKey for fornecida, sempre traduz
 * - Se children for string, verifica dinamicamente se é uma chave válida no i18n
 * - Se children for objeto/ReactNode, não traduz (dados do backend)
 * - Se skipTranslation=true, nunca traduz
 *
 * @example
 * // Tradução explícita
 * <TextRegular translationKey="contracted" />
 *
 * // Texto hardcoded (verifica se é chave válida no i18n)
 * <TextRegular>Contratado</TextRegular>
 *
 * // Dados do backend (não traduz)
 * <TextRegular>{data.producerName}</TextRegular>
 *
 * // Forçar não traduzir
 * <TextRegular skipTranslation>Texto que não deve ser traduzido</TextRegular>
 */
export const TextRegular: React.FC<TextRegularProps> = ({
  translationKey,
  params,
  children,
  skipTranslation = false,
  ...textProps
}) => {
  const { t } = useTranslation();

  const getText = (): React.ReactNode => {
    // Se skipTranslation, retorna children direto
    if (skipTranslation) {
      return children;
    }

    // Se translationKey fornecida, sempre traduz
    if (translationKey) {
      return params ? t(translationKey, params) : t(translationKey);
    }

    // Se children for string, verifica dinamicamente se é uma chave válida no i18n
    if (typeof children === 'string' && children.trim()) {
      const trimmedChildren = children.trim();
      
      // Verifica se é uma chave válida no i18n
      if (hasTranslation(trimmedChildren)) {
        return t(trimmedChildren);
      }
    }

    // Caso contrário, retorna children (assumido como dado do backend ou ReactNode)
    return children;
  };

  return (
    <StyledText {...textProps} numberOfLines={textProps.numberOfLines} adjustsFontSizeToFit={textProps.adjustsFontSizeToFit}>
      {getText()}
    </StyledText>
  );
};

export default TextRegular;

