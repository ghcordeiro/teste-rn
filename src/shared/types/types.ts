import React from 'react';

/**
 * Props compartilhadas para todos os componentes de texto
 */
export interface BaseTextProps {
  color?: string;
  size?: number;
  textAlign?: 'left' | 'right' | 'center';
  marginBottom?: number;
  marginLeft?: number;
  marginTop?: number;
  marginRight?: number;
  textDecoration?: 'underline' | 'solid' | 'none';
  width?: number | string;
  flex?: number;
  maxWidth?: number | string;
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
