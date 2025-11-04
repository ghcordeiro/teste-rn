/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import InputMask, { InputRef } from '@components/InputMask';
import { Version } from '@components/Version';
import { CenteredFlex } from '@globalStyle';
import { CommonActions, useNavigation, useRoute } from '@react-navigation/core';
import { width } from '@size';
import { useTranslation } from '@translate/hooks';
import React, { useRef, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { useAuth } from 'src/hooks/UserContext';
import Button from 'src/shared/components/Button';
import ECoop from '../../assets/images/ECoop/e-coop_logo-01.svg';
import { Container, Scroll } from './styles';

interface IRouteParams {
  params?: {
    firstLogin?: boolean;
  };
}

const ChangePassword = () => {
  const { t } = useTranslation();
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
                t('authPasswordChangedSuccess'),
                route.params?.firstLogin ? '' : t('authAppWillRestart'),
                [
                  {
                    onPress: () =>
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 1,
                          routes: [
                            {
                              name: route.params?.firstLogin
                                ? 'App'
                                : 'Initial',
                            },
                          ],
                        }),
                      ),
                    text: t('commonOk'),
                  },
                ],
              );
            })
            .catch(() => setLoadingSearch(false));
        } else {
          confirmPassRef.current?.isError(true);
          setLoadingSearch(false);
          Alert.alert(t('authPasswordsNotMatch'));
        }
      } else {
        confirmPassRef.current?.isError(true);
        setLoadingSearch(false);
        Alert.alert(t('authConfirmPasswordRequired'));
      }
    } else {
      passRef.current?.isError(true);
      setLoadingSearch(false);
      Alert.alert(t('authPasswordRequired'));
    }
  };

  const handleCancel = () => {
    Alert.alert(t('authCancelPasswordChange'), '', [
      {
        onPress: () => navigation.goBack(),
        text: t('commonYes'),
      },
      {
        onPress: () => {},
        text: t('commonNo'),
      },
    ]);
  };

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined} enabled>
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
            ref={passRef}
            icon="key"
            type="password"
            placeholder={t('authPassword')}
            isEnable
          />
          <InputMask
            ref={confirmPassRef}
            icon="key"
            type="password"
            placeholder={t('authConfirmPassword')}
            isEnable
          />
          <Button size="normal" loading={loadingSearch} onPress={handleSubmit}>
            commonChange
          </Button>
          <Button size="normal" loading={loadingSearch} onPress={handleCancel}>
            commonCancel
          </Button>
        </View>
      </Scroll>
      <Version />
    </Container>
  );
};

export default ChangePassword;
