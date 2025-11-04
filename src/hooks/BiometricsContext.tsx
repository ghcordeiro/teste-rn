import React, { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react';
import ReactNativeBiometrics, { BiometryType } from 'react-native-biometrics';

interface BiometricsContextData {
  isAvailable: boolean;
  biometryType: BiometryType | null;
  authenticate: () => Promise<boolean>;
}

const Biometrics = createContext<BiometricsContextData>({
  isAvailable: false,
  biometryType: null,
  authenticate: async () => false
});

const BiometricsProvider = ({ children }: PropsWithChildren) => {
  const biometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true })

  const [isAvailable, setIsAvailable] = useState(false);
  const [biometryType, setBiometryType] = useState<BiometryType | null>(null);

  const checkBiometricSupport = async () => {
    try {      
      const { available, biometryType } = await biometrics.isSensorAvailable();
      setIsAvailable(available);
      setBiometryType(available && biometryType ? biometryType : null);
      console.warn(available, biometryType)
    } catch (error) {
      console.error('Erro ao verificar o suporte biométrico:', error);
    }
  };
  const authenticate = useCallback(async (): Promise<boolean> => {
    try {
      const { success } = await biometrics.simplePrompt({
        promptMessage: 'Autentique-se para continuar',
        cancelButtonText: 'Cancelar',
      });
      return success;
    } catch (error) {
      console.warn('Erro ao autenticar-se:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  return (
    <Biometrics.Provider value={{ isAvailable, biometryType, authenticate }}>
      {children}
    </Biometrics.Provider>
  )
}


function useBiometris() {
  const context = useContext(Biometrics);

  if (!context) {
    throw new Error('useBiometris must be used within an BiometricsProvider');
  }

  return context;
}

export { BiometricsProvider, useBiometris }