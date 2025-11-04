import ChangePassword from 'src/pages/ChangePassword';
import Dashboard from 'src/pages/Dashboard';
import LoginCPF from 'src/pages/LoginCPF';
import PDF from 'src/pages/PDF';
import SelectProducer from 'src/pages/SelectProducer';
import LoginPassword from '../../pages/LoginPassword';
import Splash from '../../pages/Splash';
import TabsNavigation from '../Tabs';
import { StackScreenConfig } from '../types';

/**
 * Configuração centralizada de todas as rotas do Stack Navigator
 *
 * Organiza as rotas de autenticação e navegação principal
 * de forma declarativa e facilita manutenção
 */
export const STACK_ROUTES: StackScreenConfig[] = [
  {
    name: 'Splash',
    component: Splash,
  },
  {
    name: 'LoginCPF',
    component: LoginCPF,
  },
  {
    name: 'LoginPassword',
    component: LoginPassword,
  },
  {
    name: 'SelectProducer',
    component: SelectProducer,
  },
  {
    name: 'ChangePassword',
    component: ChangePassword,
  },
  {
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    name: 'App',
    component: TabsNavigation,
  },
  {
    name: 'PDF',
    component: PDF,
  },
];
