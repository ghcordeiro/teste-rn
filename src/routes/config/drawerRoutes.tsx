import { DrawerScreenConfig } from '../types';
import StackNavigation from '../Stack';

/**
 * Configuração centralizada das rotas do Drawer Navigator
 *
 * Organiza as rotas do drawer de forma declarativa
 * Atualmente possui apenas a rota "Initial" que contém o Stack Navigation
 */
export const DRAWER_ROUTES: DrawerScreenConfig[] = [
  {
    name: 'Initial',
    component: StackNavigation,
    options: {
      drawerLabelStyle: {
        color: '#FFFFFF', // Será sobrescrito pelo DrawerContent se necessário
      },
    },
  },
];

