import React, { PropsWithChildren } from 'react';
import { FirebaseProvider } from './hooks/FirebaseContext';
import { NotificationProvider } from './hooks/NotificationContext';
import { ServerContext } from './hooks/ServerContext';
import { AuthContext } from './hooks/UserContext';
import { BiometricsProvider } from './hooks/BiometricsContext';

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
