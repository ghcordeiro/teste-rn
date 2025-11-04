/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Button from '@components/Button';
import InputMask, { InputRef } from '@components/InputMask';
import { Version } from '@components/Version';
import { CenteredFlex } from '@globalStyle';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/core';
import { width } from '@size';
import { translate } from '@translate';
import React, { useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { useAuth } from 'src/hooks/UserContext';
import ECoop from '../../assets/images/ECoop/e-coop_logo-01.svg';
import { Container, Scroll } from './styles';

interface IRouteParams {
  params?: {
    firstLogin?: boolean;
  };
}

const ChangePassword = () => {
  const navigation = useNavigation();
  const auth = useAuth();
  const route: IRouteParams = useRoute();
  const passRef = useRef<InputRef>(null);
  const confirmPassRef = useRef<InputRef>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSubmit = () => {
    setLoadingSearch(true);
    if (passRef.current?.value()) {
      if (confirmPassRef.current?.value()) {
        if (confirmPassRef.current?.value() === passRef.current?.value()) {
          auth
            .changePassword(confirmPassRef.current?.value())
            .then(() => {
              setLoadingSearch(false);
              Alert.alert(
                'Senha alterada com sucesso!',
                route.params?.firstLogin
                  ? ''
                  : 'A aplicação será reiniciada, aguarde!',
                [
                  {
                    onPress: () =>
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 1,
                          routes: [
                            {
                              name: route.params?.firstLogin ? 'App' : 'Initial'
                            }
                          ]
                        })
                      ),
                    text: 'Ok'
                  }
                ]
              );
            })
            .catch(() => setLoadingSearch(false));
        } else {
          confirmPassRef.current?.isError(true);
          setLoadingSearch(false);
          Alert.alert('As senhas não coincidem');
        }
      } else {
        confirmPassRef.current?.isError(true);
        setLoadingSearch(false);
        Alert.alert('O a confirmação deve ser informado');
      }
    } else {
      passRef.current?.isError(true);
      setLoadingSearch(false);
      Alert.alert('O a senha deve ser informado');
    }
  };

  const handleCancel = () => {
    Alert.alert('Deseja mesmo cancelar a alteração de senha?', '', [
      {
        onPress: () => navigation.goBack(),
        text: 'Sim'
      },
      {
        onPress: () => {},
        text: 'Não'
      }
    ]);
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
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
            autoFocus
            ref={passRef}
            icon="key"
            type="password"
            placeholder={translate('password')}
            isEnable
          />
          <InputMask
            ref={confirmPassRef}
            icon="key"
            type="password"
            placeholder={translate('confirmPassword')}
            isEnable
          />
          <Button size="normal" loading={loadingSearch} onPress={handleSubmit}>
            change
          </Button>
          <Button size="normal" loading={loadingSearch} onPress={handleCancel}>
            cancel
          </Button>
        </View>
      </Scroll>
      <Version />
    </Container>
  );
};

export default ChangePassword;
