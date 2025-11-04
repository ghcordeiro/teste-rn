import { createNavigationContainerRef } from '@react-navigation/native';

// Cria uma referência de navegação usando a API recomendada do React Navigation
// Isso funciona melhor com NavigationContainer independent
export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  // Verifica se o navigationRef está pronto antes de navegar
  // Isso é importante especialmente com NavigationContainer independent
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  } else {
    console.warn('[Navigation] Navigation ref is not ready yet');
  }
}

export function resetToRoot() {
  // Verifica se o navigationRef está pronto antes de resetar
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({
      index: 0,
      routes: [
        {
          name: 'Initial' as never,
        },
        {
          name: 'App' as never,
        },
        {
          name: 'Informativos' as never,
        },
      ],
    });
  } else {
    console.warn('[Navigation] Navigation ref is not ready yet');
  }
}
