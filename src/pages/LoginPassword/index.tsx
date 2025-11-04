/* eslint-disable prettier/prettier */
import Colors from '@colors';
import Button from '@components/Button';
import InputMask, { InputRef } from '@components/InputMask';
import Select from '@components/Select';
import { Version } from '@components/Version';
import { IServerConfig } from '@dtos/server';
import { CenteredFlex } from '@globalStyle';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/core';
import { width } from '@size';
import { useTranslation } from '@translate/hooks';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform, SafeAreaView, View } from 'react-native';
import { useServer } from 'src/hooks/ServerContext';
import { useAuth } from 'src/hooks/UserContext';
import Toast from 'src/utils/toast';
import ECoop from '../../assets/images/ECoop/e-coop_logo-01.svg';
import { Container, Scroll } from './styles';

interface IRouteProps {
  params?: {
    cpf?: string;
  };
}

const LoginPassword = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route: IRouteProps = useRoute();
  const auth = useAuth();
  const cpfRef = useRef<InputRef>(null);
  const { serversConfig, envServer, configApiServer} = useServer();
  const [loginServer, setLoginServer] = useState<IServerConfig|undefined>(envServer);
  const passwordRef = useRef<InputRef>(null);

  const [CPF] = useState<string>(route.params?.cpf || '');
  const [PW] = useState<string>();
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    if (!serversConfig || serversConfig.length === 0){
      setLoginServer(undefined);
    } else if(!loginServer) {
      setLoginServer(serversConfig[0]);
    }

  }, [serversConfig]);

  const handleSubmit = async () => {
    setLoadingSearch(true);
    try {
      const fullLogin = cpfRef.current?.value();
      const password = passwordRef.current?.value();
      if (!fullLogin) {
        cpfRef.current?.isError(true);
        //Alert.alert('CPF não informado!');
        Toast.show(t('login_not_provided'));
        return;
      }
      const cpfMask = fullLogin.replaceAll('.', '').replace('-', '');
      if (!cpfMask || cpfMask.length !== 11){
        cpfRef.current?.isError(true);
        return;
      }
      if (!password) {
        passwordRef.current?.isError(true);
        //Alert.alert('Senha não informada!');
        Toast.show(t('password_not_provided'));
        return;
      }
      if (!loginServer && serversConfig && serversConfig.length > 1){
        //Alert.alert('Selecione a Cooperativa!');
        Toast.show(t('env_not_provided'));
        return;
      }
      if (!loginServer){
        throw 'Invalid credentials';
      }
      await configApiServer(loginServer);
      const user = await auth.signIn({
        login: cpfMask,
        password,
      });
      if (user?.user?.newPassword) {
        Alert.alert(
          'Para continuar, é necessário definir uma nova senha',
          '',
          [
            {
              onPress: () =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{ name: 'ChangePassword' }],
                  })
                ),
              text: t('confirm'),
            },
          ]
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'Dashboard' }],
          })
        );
      }
    } catch (error) {

      console.log('Erro ao fazer login com senha:', error);
      if (error === 'Invalid credentials') {
        Toast.show(t('status401'));
      }
      passwordRef.current?.isError(true);
      setLoadingSearch(false);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'LoginCPF' }],
      })
    );
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: Colors.ecoop.darkGray }} />
      <Container
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <Scroll
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <CenteredFlex>
            <ECoop
              width={width - width / 4}
              height={width - 128}
              style={{ marginTop: -width / 4 }}
            />
          </CenteredFlex>
          <View>
            <InputMask
              autoFocus={false}
              ref={cpfRef}
              icon="id-card"
              type="cpf"
              placeholder={t('cpf')}
              isEnable={false}
              savedValue={CPF}
            />
            <InputMask
              autoFocus
              ref={passwordRef}
              icon="key"
              type="password"
              placeholder={t('password')}
              isEnable
              savedValue={PW}
            />
            {serversConfig && serversConfig.length > 1 && (
              <Select
                propertyValue="code"
                propertyLabel="companyCodeTxt"
                defaultValue={envServer?.code || serversConfig[0].code}
                options={serversConfig || []}
                returnObject={true}
                key="SelectEnvServer"
                name="SelectEnvServer@session"
                onActionChange={(value: IServerConfig) => {
                  setLoginServer(value);
                }}
              />
            )}
            <Button size="normal" loading={loadingSearch} onPress={handleSubmit}>
              login
            </Button>

            <Button size="normal" loading={loadingSearch} onPress={handleBack}>
              back
            </Button>
          </View>
        </Scroll>
        <Version />
      </Container>
    </>
  );
};

export default LoginPassword;
