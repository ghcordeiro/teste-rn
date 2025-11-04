import {CommonActions, useNavigation} from '@react-navigation/core';
import {useTranslation} from '@translate/hooks';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert} from 'react-native';
import Header from 'src/components/Header';
import {useAuth} from 'src/hooks/UserContext';
import Toast from 'src/utils/toast';

import BarChartVerticalWithLabels from 'src/components/BarChartVerticalWithLabels';
import PieChart from 'src/components/PieChart';

import Colors from '@colors';
import {Flex, StyledView, TextBold} from '@globalStyle';
import CardChart from 'src/components/CardChart';
import FilterCropCulture from 'src/components/Filters/FilterCropCulture';
import Loading from 'src/components/Loading';
import {ICardGraphData, ISalesPosition} from 'src/dtos/graphics';
import {useFirebase} from 'src/hooks/FirebaseContext';
import api from 'src/services/api';
import {ButtonSelect, Container, ContainerCards} from './styles';

interface TopVendas {
  crop: string;
  culture: string;
  buyerCode: string;
  buyer: string;
  quantity: number;
  measurementUnit: string;
}

interface IDashFilterProps {
  culture?: string;
  crop?: string;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const auth = useAuth();
  const {nextPage} = useFirebase();

  const [onLoadingCrop, setOnLoadingCrop] = useState<boolean>(true);
  const [loadingTopVendas, setLoadingTopVendas] = useState<boolean>(true);
  const [loadingCardGraph, setLoadingCardGraph] = useState<boolean>(true);
  const [loadingSalesPosition, setLoadingSalesPosition] =
    useState<boolean>(true);

  const [topVendas, setTopvendas] = useState<Array<TopVendas>>(
    [] as Array<TopVendas>,
  );
  const [salesPosition, setSalesPosition] = useState<ISalesPosition>(
    {} as ISalesPosition,
  );
  const [cardGraph, setCardGraph] = useState<ICardGraphData>();
  
  // Ref para manter key estável do CardChart e evitar re-renders
  const cardChartKeyRef = useRef(`card-chart-${Date.now()}`);

  useEffect(() => {
    if (nextPage) {
      Alert.alert('Nova notificação', 'Escolha o cooperado para continuar');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTopVendas = useCallback(async ({crop, culture}: IDashFilterProps) => {
    try {
      setLoadingTopVendas(true);
      const response = await api.get(
        `salescontract/topsales/${crop}/${culture}?limit=6`,
      );
      setTopvendas(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingTopVendas(false);
    }
  }, []);

  const loadSalesPosition = useCallback(async ({crop, culture}: IDashFilterProps) => {
    try {
      setLoadingSalesPosition(true);
      const response = await api.get(
        `salescontract/salesposition/${crop}/${culture}`,
      );
      setSalesPosition(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingSalesPosition(false);
    }
  }, []);

  const loadCardGraph = useCallback(async ({crop, culture}: IDashFilterProps) => {
    try {
      setLoadingCardGraph(true);
      const response = await api.get(
        `salescontract/priceposition/${crop}/${culture}`,
      );
      setCardGraph(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingCardGraph(false);
    }
  }, []);

  const handleSelect = useCallback(async (id: string) => {
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
                  text: t('confirm'),
                },
              ],
            );
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [{name: 'App'}],
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
  }, [auth, navigation, t]);

  const onRefreshData = useCallback(async (filter: string) => {
    if (!filter) {
      return;
    }
    // Limpa dados anteriores durante o carregamento
    setCardGraph(undefined);
    setSalesPosition({} as ISalesPosition);
    setTopvendas([] as Array<TopVendas>);
    
    const filtro = {
      crop: filter.split('-')[1],
      culture: filter.split('-')[0],
    };

    // Carrega dados em paralelo para melhor performance
    await Promise.all([
      loadTopVendas(filtro),
      loadSalesPosition(filtro),
      loadCardGraph(filtro),
    ]);
  }, [loadTopVendas, loadSalesPosition, loadCardGraph]);

  // Ref para armazenar o último filtro aplicado e evitar re-renders infinitos
  const lastFilterRef = useRef<string | null>(null);

  const handleSetCropCultureFilter = useCallback(async (cropCulture: string) => {
    // Evita processar o mesmo filtro múltiplas vezes
    if (lastFilterRef.current === cropCulture) {
      return;
    }
    lastFilterRef.current = cropCulture;
    await onRefreshData(cropCulture);
  }, [onRefreshData]);

  // Memoiza a lista de producers para evitar re-renders desnecessários
  const producersList = useMemo(() => {
    return auth.user?.producers || [];
  }, [auth.user?.producers]);

  // Memoiza o callback de loading para evitar re-renders no FilterCropCulture
  const handleLoadingChange = useCallback((loading: boolean) => {
    setOnLoadingCrop(loading);
  }, []);

  return (
    <>
      <Header showBackButton={false} showRightButton={false} />
      <Container>
        <Flex marginBottom={16}>
          <FilterCropCulture
            onActionChange={handleSetCropCultureFilter}
            onLoading={handleLoadingChange}
            allCropCulture={false}
          />
        </Flex>
        {onLoadingCrop && <Loading />}
        {!onLoadingCrop && (
          <>
            <PieChart data={salesPosition} loading={loadingSalesPosition} />
            <BarChartVerticalWithLabels data={topVendas} />
            <ContainerCards>
              <CardChart
                key={cardChartKeyRef.current}
                data={cardGraph}
                loading={loadingCardGraph}
              />
            </ContainerCards>
            <StyledView marginTop={24} marginBottom={36}>
              {producersList.map(r => (
                <ButtonSelect
                  onPress={() => handleSelect(r.id)}
                  key={r.id}>
                  <TextBold color={Colors.default.text}>{r.name}</TextBold>
                </ButtonSelect>
              ))}
            </StyledView>
          </>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
