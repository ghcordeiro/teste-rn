import Colors from '@colors';
import { IconWithCount } from '@components/IconWithCount';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import Ecooperativa from 'src/assets/images/ECoop/ecooperativa.svg';
import { useServer } from 'src/hooks/ServerContext';
import { useAuth } from 'src/hooks/UserContext';
import { useWithdrawal } from 'src/hooks/WithdrawalContext';
import {
  ColumnBackButton,
  ColumnFilterButton,
  Container,
  ContainerBackButton,
  ContainerLogo,
} from './styles';

interface ICardHeader {
  showBackButton: boolean;
  showRightButton?: boolean;
}

const Header = ({ showBackButton, showRightButton = true }: ICardHeader) => {
  const navigation = useNavigation();
  const { items } = useWithdrawal();
  const { user } = useAuth();
  const { envServer } = useServer();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleWithdrawalCart = () => {
    navigation.navigate('WithdrawalCart');
  };
  useEffect(() => {
    console.log('ICardHeader envServer => ', envServer);
  }, [envServer]);

  return (
    <Container>
      <ContainerBackButton>
        {showBackButton && (
          <ColumnBackButton onPress={handleBack}>
            <FontAwesome name="arrow-left" size={26} color={Colors.white} />
          </ColumnBackButton>
        )}
      </ContainerBackButton>
      <ContainerLogo>
        <Ecooperativa height={30} width={200} />
        {/*envServer && <TextBold color={Colors.ecoop.primary} size={24}>
          {envServer.companyCode}
        </TextBold> */}
      </ContainerLogo>
      <ContainerBackButton>
        {showRightButton &&
          user?.permissions.find(f => f === 'APP:STOCKWITHDRAWAL') && (
            <ColumnFilterButton onPress={handleWithdrawalCart}>
              <IconWithCount
                action={handleWithdrawalCart}
                count={items?.length}
                icon="shopping-cart"
                color={Colors.white}
              />
            </ColumnFilterButton>
          )}
      </ContainerBackButton>
    </Container>
  );
};

export default Header;
