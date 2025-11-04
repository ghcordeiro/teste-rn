import Colors from '@colors';
import Button from '@components/Button';
import InputMask, { InputRef } from '@components/InputMask';
import { Version } from '@components/Version';
import { CenteredFlex } from '@globalStyle';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/core';
import { width } from '@size';
import { useTranslation } from '@translate/hooks';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import { useBiometris } from 'src/hooks/BiometricsContext';
import { useServer } from 'src/hooks/ServerContext';
import { User, useAuth } from 'src/hooks/UserContext';
import Toast from 'src/utils/toast';
import ECoop from '../../assets/images/ECoop/e-coop_logo-01.svg';
import { Container, Scroll } from './styles';

interface IRouteProps {
  params?: {
    user?: User;
    hasUser?: boolean;
  };
}

const LoginCPF = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const server = useServer();
  const inputRef = useRef<InputRef>(null);
  const { authenticate, isAvailable, biometryType } = useBiometris();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const auth = useAuth();
  const { params }: IRouteProps = useRoute();
  const [login, setLogin] = useState<string | undefined>(
    params?.user?.user?.login,
  );
  const [user, setUser] = useState<User | undefined>(params?.user);
  const [_loading, setLoading] = useState(true);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const newLogin = async () => {
    console.log('== > newLogin => ');
    await loginWithPassword();
    setLogin(undefined);
    inputRef.current?.setValue(undefined);
    inputRef.current?.isError(false);
    inputRef.current?.setIsValid(true);
  };

  const loginWithPassword = useCallback(async () => {
    console.log('== > loginWithPassword => ');
    await auth.signOut();
    setUser(undefined);
    inputRef.current?.isError(false);
    inputRef.current?.setIsValid(true);
  }, [auth, inputRef]);

  const textButonLogin = (): string => {
    if (user && failedAttempts <= 2 && isAvailable) {
      const biometryKey = biometryType === 'FaceID' ? 'FaceID' : 'Biometria';
      return t(biometryKey);
    } else {
      return t('next');
    }
  };

  useEffect(() => {
    (async () => {
      if (params?.hasUser && isAvailable) {
        if (user) {
          setLoading(false);
          inputRef.current?.setIsValid(true);
        }
      } else {
        await loginWithPassword();
        setLoading(false);
      }
    })();
  }, [isAvailable, loginWithPassword, params, user]);

  const loginPassword = async () => {
    console.log('== > loginPassword => ');
    if (!inputRef?.current?.isValid()) {
      return;
    }
    const fullLogin = inputRef.current?.value();
    console.log('== > loginPassword => fullLogin => ', fullLogin);
    if (!fullLogin) {
      inputRef.current?.isError(true);
      //Alert.alert('CPF não informado');
      Toast.show(t('login_not_provided'));
      return;
    }
    const cpfMask = fullLogin.replaceAll('.', '').replace('-', '');
    if (!cpfMask || cpfMask.length !== 11) {
      inputRef.current?.isError(true);
      return;
    }

    await server.getConfigServer(cpfMask);
    setFailedAttempts(0);
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'LoginPassword',
            params: {
              cpf: cpfMask,
            },
          },
        ],
      }),
    );
  };
  const loginBiometrics = async () => {
    console.log('== > loginBiometrics => ');
    try {
      const success = await authenticate();
      if (success) {
        // Verificar se temos credenciais salvas para fazer o login
        if (!auth.credentials?.login || !auth.credentials?.password) {
          console.error('Credenciais não encontradas');
          Toast.show(t('credentials_not_found'));
          setFailedAttempts(prev => prev + 1);
          return;
        }

        // Fazer login com as credenciais salvas
        console.log('== > loginBiometrics => signIn => ');
        const loggedUser = await auth.signIn(
          {
            login: auth.credentials.login,
            password: auth.credentials.password,
          },
          auth.cooperado,
        );

        // Verificar se o login foi bem-sucedido
        if (loggedUser && loggedUser.token) {
          console.log('== > loginBiometrics => login success => ');
          setUser(undefined);
          setFailedAttempts(0);
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{ name: 'Dashboard' }],
            }),
          );
        } else {
          // Se não tem token, precisa ir para a tela de senha
          console.log(
            '== > loginBiometrics => no token, going to password => ',
          );
          const cpfMask = user?.user?.login?.replace(/[.-]/g, '') || '';
          if (cpfMask) {
            await server.getConfigServer(cpfMask);
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'LoginPassword',
                    params: {
                      cpf: cpfMask,
                    },
                  },
                ],
              }),
            );
          }
        }
      } else {
        setFailedAttempts(prev => prev + 1);
        if (failedAttempts < 2) {
          Toast.show(t('auth_failed_try_again'));
        } else if (failedAttempts === 2) {
          Toast.show(t('auth_failed_use_password'));
        }
      }
    } catch (error) {
      console.error('Erro no login biométrico:', error);
      setFailedAttempts(prev => prev + 1);
      Toast.show(t('auth_failed_try_again'));
    }
  };
  const handleSubmit = async () => {
    setLoadingSearch(true);
    console.log('== > handleSubmit => ');
    try {
      if (user && failedAttempts <= 2 && isAvailable) {
        console.log('== > handleSubmit => loginBiometrics => ');
        await loginBiometrics();
      } else {
        console.log('== > handleSubmit => loginPassword => ');
        await loginPassword();
      }
    } catch (error) {
      // Alert.alert('Erro inesperado. Por favor, tente novamente.');
      Toast.show(t('unexpected_error_try_again'));
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: Colors.ecoop.darkGray }} />
      <Container
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <Scroll
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
        >
          <CenteredFlex>
            <ECoop
              width={width - width / 4}
              height={width - 128}
              style={{ marginTop: -width / 4 }}
            />
          </CenteredFlex>
          <View>
            <InputMask
              autoFocus
              ref={inputRef}
              icon="id-card"
              type="cpf"
              placeholder={t('cpf')}
              savedValue={login}
              isEnable={!user?.user?.login}
            />
            <Button
              size="normal"
              loading={loadingSearch}
              onPress={handleSubmit}
            >
              {textButonLogin()}
            </Button>
            {user && (
              <Button size="normal" loading={loadingSearch} onPress={newLogin}>
                {t('change_user')}
              </Button>
            )}
          </View>
        </Scroll>
        <Version />
      </Container>
    </>
  );
};

export default LoginCPF;
