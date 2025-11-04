import Colors from '@colors';
import {Version} from '@components/Version';
import {TextBold} from '@globalStyle';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {translate} from '@translate';
import {Alert, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAuth} from 'src/hooks/UserContext';
import Toast from 'src/utils/toast';
import {ButtonSelect, Container, Scroll} from './styles';

const SelectProducer = () => {
  const navigation = useNavigation();
  const auth = useAuth();

  const handleSelect = async (id: string) => {
    if (auth.credentials) {
      try {
        const user = await auth.signIn(auth.credentials, id);
        if (user) {
          auth.setProducer(id);
          if (user.user.newPassword) {
            Alert.alert(
              'Para continuar, é necessário definir uma nova senha',
              '',
              [
                {
                  onPress: () =>
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 1,
                        routes: [
                          {
                            name: 'ChangePassword',
                            params: {firstLogin: true},
                          },
                        ],
                      }),
                    ),
                  text: translate('confirm'),
                },
              ],
            );
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'Dashboard'}],
              }),
            );
          }
        }
      } catch (e: any) {
        Toast.show(e);
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'LoginPassword',
                params: {
                  cpf: auth.credentials.login,
                },
              },
            ],
          }),
        );
      }
    }
  };

  return (
    <>
      <SafeAreaView style={{backgroundColor: Colors.ecoop.darkGray}} />
      <Container
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <TextBold color={Colors.white}>
          {translate('selectthecooperative')}
        </TextBold>
        <Scroll showsVerticalScrollIndicator={false}>
          {auth.user?.producers.map(r => (
            <ButtonSelect
              onPress={() => handleSelect(r.id)}
              key={String(Math.random())}>
              <TextBold color={Colors.white}>{r.name}</TextBold>
            </ButtonSelect>
          ))}
        </Scroll>
        <SafeAreaView />
        <Version />
      </Container>
    </>
  );
};

export default SelectProducer;
