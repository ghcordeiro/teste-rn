import React, { useEffect, useRef, useState } from 'react';

import HeaderContent from '@components/HeaderContent';
import ModalSelectRetirada, {
  IModalSelectRetiradaProps,
} from '@components/ModalSelectRetirada';
import { useNavigation } from '@react-navigation/core';
import { useTranslation } from '@translate/hooks';
import {
  CardHomeMoviment,
  IFinancialStatementProps,
} from 'src/features/financial';
import { useFirebase } from 'src/hooks/FirebaseContext';
import { useAuth } from 'src/hooks/UserContext';
import api from 'src/services/api';
import { Button, Header } from 'src/shared';
import { navigate } from '../../services/navigation';
import { Container, ContainerButtonDash, Space } from './styles';

const Home = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const { nextPage } = useFirebase();
  const navigation = useNavigation();
  // const [loading, setLoading] = useState<boolean>(false);
  const [dataMovto, setDataMovot] = useState<IFinancialStatementProps[]>(
    [] as Array<IFinancialStatementProps>,
  );
  const [balance, setBalance] = useState<any>({});
  const [dataMovtoFuture, setDataMovtoFuture] = useState<
    IFinancialStatementProps[]
  >([] as Array<IFinancialStatementProps>);

  useEffect(() => {
    if (nextPage) {
      navigation.navigate(nextPage.name, nextPage.params);
    }
    api.get('financialstatement/list?limit=4&sort=-dateOf').then(r => {
      setDataMovot(r.data.rows);
    });
    api.get('financialstatement/balance').then(r => {
      setBalance(r.data);
    });
    api.get('financialstatement/future/list?limit=4&sort=-dateOf').then(r => {
      setDataMovtoFuture(r.data.rows);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modalRef = useRef<IModalSelectRetiradaProps>(null);

  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };

  return (
    <>
      <Header showBackButton={false} />
      <HeaderContent balance={balance} />
      <Container showsVerticalScrollIndicator={false}>
        <ContainerButtonDash>
          <Button
            loading={false}
            onPress={() => navigate('Dashboard')}
            icon="bar-chart"
          >
            {t('Dashboard')}
          </Button>
        </ContainerButtonDash>
        {auth.user?.permissions.find(
          f => f === 'APP:STOCKWITHDRAWAL' || f === 'APP:DELIVERYTRACKING',
        ) ? (
          <ContainerButtonDash>
            <Button
              loading={false}
              onPress={handleOpenModal}
              icon="shopping-cart"
            >
              {t('Retiradas')}
            </Button>
          </ContainerButtonDash>
        ) : (
          <></>
        )}
        {auth.user?.permissions.find(f => f === 'APP:FINANCIAL-STATEMENT') ? (
          <CardHomeMoviment
            route="FinancialStatement"
            data={dataMovto}
            title={t('lastMovimentations')}
          />
        ) : (
          <></>
        )}
        <Space />
        {auth.user?.permissions.find(f => f === 'APP:FINANCIAL-STATEMENT') ? (
          <CardHomeMoviment
            route=""
            data={dataMovtoFuture}
            title="Lançamentos futuros da ficha"
          />
        ) : (
          <></>
        )}
        <Space />
        <Space />
        <Space />
      </Container>
      <ModalSelectRetirada ref={modalRef} />
    </>
  );
};

export default Home;

// APP:STOCK
// APP:CONTRACT
// APP:FINANCIAL-STATEMENT
// APP:FINANCIAL
