import { getTranslations, hasTranslation } from '@translate';
import { useTranslation } from '@translate/hooks';
import React from 'react';
import { BaseTextProps } from '../../types/types';
import { StyledText } from './styles';

export type TextRegularProps = BaseTextProps;

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

    // Se translationKey fornecida, sempre tenta traduzir
    // O t() já tem fallback seguro que retorna a chave se não encontrar tradução
    if (translationKey) {
      return params ? t(translationKey, params) : t(translationKey);
    }

    // Se children for string, verifica dinamicamente se é uma chave válida no i18n
    if (typeof children === 'string' && children.trim()) {
      const trimmedChildren = children.trim();

      // Primeiro verifica se o texto é uma chave válida diretamente (ex: "contracted")
      if (hasTranslation(trimmedChildren)) {
        return t(trimmedChildren);
      }

      // Se não for chave, tenta encontrar a chave pelo valor traduzido (reverse lookup)
      // Isso ajuda quando textos hardcoded coincidem com valores traduzidos
      const translations = getTranslations();
      if (translations) {
        // Procura uma chave cujo valor traduzido seja igual ao texto
        const foundKey = Object.keys(translations).find(
          key => translations[key] === trimmedChildren,
        );
        if (foundKey) {
          return t(foundKey);
        }
      }
    }

    // Caso contrário, retorna children (assumido como dado do backend ou ReactNode)
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

export default TextRegular;
