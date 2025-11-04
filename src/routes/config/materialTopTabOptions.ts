import Colors from '@colors';
import { MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { normalize } from '@size';

/**
 * Configuração padrão para Material Top Tab Navigator
 *
 * Reutilizável em várias telas de detalhes para evitar código duplicado.
 * Segue o padrão estabelecido no RELATORIO_ARQUITETURA.md - Fase 1: Simplificação da Navegação
 */
export const getMaterialTopTabScreenOptions = (options?: {
  scrollEnabled?: boolean;
}): MaterialTopTabNavigationOptions => ({
  tabBarStyle: {
    backgroundColor: Colors.ecoop.darkGray,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold' as const,
    width: '100%',
    textAlign: 'center' as const,
    margin: 0,
    padding: 0,
    fontSize: normalize(12),
  },
  tabBarActiveTintColor: '#FFF',
  tabBarInactiveTintColor: '#ADADAD',
  tabBarIndicatorStyle: {
    marginBottom: 4,
    backgroundColor: '#FFF',
  },
  tabBarScrollEnabled: options?.scrollEnabled ?? false,
});
