import React, { PropsWithChildren } from 'react';
import { BiometricsProvider } from './hooks/BiometricsContext';
import { FirebaseProvider } from './hooks/FirebaseContext';
import { NotificationProvider } from './hooks/NotificationContext';
import { ServerContext } from './hooks/ServerContext';
import { AuthContext } from './hooks/UserContext';

/**
 * AppProvider - Componente principal que agrupa todos os context providers
 *
 * Nota: React.memo foi removido temporariamente devido a problemas de compatibilidade
 * com o Metro bundler. A otimização pode ser re-adicionada posteriormente se necessário.
 */
const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <FirebaseProvider>
      <AuthContext>
        <BiometricsProvider>
          <ServerContext>
            <NotificationProvider>{children}</NotificationProvider>
          </ServerContext>
        </BiometricsProvider>
      </AuthContext>
    </FirebaseProvider>
  );
};

export default AppProvider;
