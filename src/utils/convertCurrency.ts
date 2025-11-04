import { getLocale } from '@translate';

// Mapeamento de Moedas
const Moeda = {
  US$: 'USD',
  R$: 'BRL',
};

// Função para formatar números grandes
const formatLargeNumbers = (value: number) => {
  const absValue = Math.abs(value);
  if (absValue >= 1_000_000_000) {
    return { value: value / 1_000_000_000, label: 'bi' };
  }
  if (absValue >= 1_000_000) {
    return { value: value / 1_000_000, label: 'mi' };
  }
  if (absValue >= 1_000) {
    return { value: value / 1_000, label: 'mil' };
  }
  return { value, label: '' };
};

// Função para formatar moeda
const formatCurrency = (
  value?: number,
  prefix?: string,
  abbreviate = false,
  exibePrefix = true,
) => {
  if (value === undefined || value === null) {
    return `${prefix || ''} 0`;
  }

  // Abreviação de valores
  if (abbreviate) {
    const { value: formattedValue, label } = formatLargeNumbers(value);
    return `${prefix || ''} ${formattedValue
      .toFixed(2)
      .replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1')
      .replace('.', ',')} ${label}`;
  }

  // Formatação de moeda com ou sem prefixo
  const currency = Moeda[prefix || 'R$'] || 'BRL';
  const formattedValue = new Intl.NumberFormat(getLocale().replace('_', '-'), {
    style: 'currency',
    currency,
  }).format(value);

  if (!exibePrefix) {
    return formattedValue.replace(/^(-?)[^\d]+/, '$1'); // Remove o prefixo
  }

  return formattedValue.replace(currency, `${prefix || ''} `);
};

export default formatCurrency;
