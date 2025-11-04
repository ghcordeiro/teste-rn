import { ComponentType } from 'react';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { ParamListBase } from '@react-navigation/native';

/**
 * Tipo para configuração de uma rota de Tab
 */
export interface TabScreenConfig {
  name: string;
  component: ComponentType<any>;
  initialParams?: Record<string, any>;
  options?:
    | object
    | ((props: BottomTabScreenProps<ParamListBase>) => object);
}

/**
 * Tipo para configuração de uma rota de Stack
 */
export interface StackScreenConfig {
  name: string;
  component: ComponentType<any>;
  initialParams?: Record<string, any>;
  options?:
    | object
    | ((props: StackScreenProps<ParamListBase>) => object);
}

/**
 * Tipo para configuração de uma rota de Drawer
 */
export interface DrawerScreenConfig {
  name: string;
  component: ComponentType<any>;
  initialParams?: Record<string, any>;
  options?: object;
}

