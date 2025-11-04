/**
 * Tipos TypeScript para o sistema de i18n
 * Garante type-safety nas traduções
 */

// Tipos de locale suportados
export type Locale = 'pt_BR' | 'en_US' | 'pt' | 'en';

// Interface para as traduções
export interface Translations {
  // Saudações
  goodMorning: string;
  goodAfternoon: string;
  goodNight: string;

  // Dias da semana
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;

  // Formatação de data
  dateExtend: string;

  // Mensagens de erro HTTP
  status400: string;
  status401: string;
  status403: string;
  status500: string;

  // Ações gerais
  logout: string;
  password: string;
  cancel: string;
  accept: string;
  decline: string;
  failed: string;
  confirmLogout: string;
  save: string;
  login: string;
  config: string;
  confirm: string;
  back: string;
  change: string;

  // Permissões
  externalStoragePermission: string;
  requestPermission: string;
  accessStorage: string;

  // Servidor
  invalidServerData: string;
  errorServerData: string;
  errorConnectServer: string;
  accessToken: string;
  tryAgain: string;

  // Financeiro
  accountBalance: string;
  lastMovimentations: string;
  activeContracts: string;
  balance: string;
  value: string;
  price: string;
  amount: string;

  // Dashboard
  Dashboard: string;
  Home: string;
  Configuration: string;
  Informativos: string;
  Notificações: string;
  Retiradas: string;

  // Notificações
  newVersion: string;
  newVersionDescription: string;

  // Outros
  [key: string]: string;
}

// Opções para a função translate
export interface TranslateOptions {
  defaultValue?: string;
  count?: number;
  [key: string]: any;
}

// Configuração do i18n
export interface I18nConfig {
  translations: Record<Locale, Translations>;
  defaultLocale: Locale;
  fallbacks?: boolean;
}

