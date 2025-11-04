import {CommonActions, useNavigation} from '@react-navigation/core';
import {PropsWithChildren, useEffect, useState} from 'react';
import {Animated, Easing, SafeAreaView} from 'react-native';
import {width} from '@size';
import {useAuth} from 'src/hooks/UserContext';
import api from 'src/services/api';
import ECoop from '../../assets/images/ECoop/e-coop_logo-01.svg';

import {Container} from './styles';

const Splash = ({children}: PropsWithChildren) => {
  const navigation = useNavigation();
  const {user, credentials, loading} = useAuth();
  const [position] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));
  const duration = 5 * 1000;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
        easing: Easing.bounce,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: duration / 3,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(async () => {
      console.log(user);
      if (!loading) {
        if (user && user.token) {
          try {
            const userReturn = await api.get('session/user', {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            });
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'LoginCPF',
                    params: {
                      user: userReturn.data,
                      hasUser: true,
                    },
                  },
                ],
              }),
            );
          } catch (e) {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'LoginCPF',
                    params: {
                      user: undefined,
                      hasUser: false,
                    },
                  },
                ],
              }),
            );
          }
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'LoginCPF',
                  params: {
                    user: undefined,
                    hasUser: false,
                  },
                },
              ],
            }),
          );
        }
      }
    }, duration);
  }, [credentials, duration, loading, navigation, opacity, position, user]);

  return (
    <>
      <SafeAreaView />
      <Container>
        <Animated.View
          style={[
            {
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              opacity,
            },
            {
              transform: [{scale: position}],
            },
          ]}>
          <ECoop width={width - width / 4} height={width - 128} />
        </Animated.View>
      </Container>
    </>
  );
};

export default Splash;
