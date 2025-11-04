import { CommonActions, useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { Animated, SafeAreaView } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useAuth } from 'src/hooks/UserContext';
import api from 'src/services/api';
import ECoop from '../../assets/images/ECoop/e-coop_logo-01.svg';

import { Container } from './styles';

const Splash = () => {
  const navigation = useNavigation();
  const { user, credentials, loading } = useAuth();
  const [position] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(0));
  const duration = 5 * 1000;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: 1,
        duration: duration / 2,
        useNativeDriver: true,
        easing: Easing.bounce
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: duration / 3,
        useNativeDriver: true
      })
    ]).start();

    setTimeout(async () => {
      if (!loading) {
        if (user && user.token) {
          try {
            await api.get('session/user', {
              headers: {
                Authorization: `Bearer ${user.token}`
              }
            });
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'Dashboard'
                    // name: 'App'
                  }
                ]
              })
            );
          } catch (e) {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'LoginCPF'
                  }
                ]
              })
            );
          }
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'LoginCPF'
                }
              ]
            })
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
              opacity
            },
            {
              transform: [{ scale: position }]
            }
          ]}>
          <ECoop />
        </Animated.View>
      </Container>
    </>
  );
};

export default Splash;
