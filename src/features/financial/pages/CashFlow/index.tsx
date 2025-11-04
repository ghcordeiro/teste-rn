import Colors from '@colors';
import { IFilterModalProps } from '@dtos/FilterModalProps';
import EFinancialStatementOperation from '@enum/EFinancialStatementOperation';
import { Flex, Row, TextBold, TextRegular } from '@globalStyle';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { normalize } from '@size';
import convertCurrency from '@utils/convertCurrency';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import api from 'src/services/api';
import { FloatingButton, Header, Loading } from 'src/shared';
import { TabCashFlow } from '../../';
import { ICashFlow, ICashFlowResume } from '../../types/cash-flow';
import FilterModalCashFlow from './FilterModalCashFlow';
import { Container, ContainerContractPosition, SectionGeneral } from './styles';

const Tab = createMaterialTopTabNavigator();

// Interface compartilhada para os filtros do fluxo de caixa
export interface ICashFlowFilters {
  operation?: EFinancialStatementOperation;
  status?: string[];
  documentType?: string;
  producer?: string;
  expirationdateend?: number;
  expirationdatenextperiod?: number;
  nextRows?: boolean;
}

const CashFlow = () => {
  const [dataGeneral, setDataGeneral] = useState<ICashFlow>({} as ICashFlow);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [reload, setReload] = useState<boolean>(false);
  const modalRef = useRef<IFilterModalProps>(null);
  const realTabRef = useRef(null);
  const dollarTabRef = useRef(null);

  // Estado para armazenar os filtros atuais
  const [currentFilters, setCurrentFilters] = useState<ICashFlowFilters>({});

  const [operationFilter, setOperationFilter] =
    useState<EFinancialStatementOperation>();
  const [statusFilter, setStatusFilter] = useState<string[]>();
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>();
  const [producerFilter, setProducerFilter] = useState<string>('ALL');
  const [expirationDateEndFilter, setExpirationDateEndFilter] =
    useState<number>();
  const [expirationDateNextPeriodFilter, setExpirationDateNextPeriodFilter] =
    useState<number>();

  const [cashFlowData, setCashFlowData] = useState<
    Record<string, ICashFlowResume[]>
  >({ R$: [], US$: [] });
  const [allRowsMap, setAllRowsMap] = useState<Record<string, number>>({
    R$: -1,
    US$: -1,
  });
  const [loadingTabs, setLoadingTabs] = useState<Record<string, boolean>>({
    R$: false,
    US$: false,
  });

  const getFilters = (filters: ICashFlowFilters): string[] => {
    const {
      status,
      producer,
      documentType,
      expirationdateend,
      expirationdatenextperiod,
      operation,
    } = filters;
    const filter: string[] = [];
    let producerFilters = producer || 'ALL';
    filter.push(`producer=${producerFilters}`);
    setCurrentFilters(prevState => ({
      ...prevState,
      producer: producerFilters,
    }));
    if (status && status.length > 0) filter.push(`status=${status}`);
    if (operation) filter.push(`operation=${operation}`);
    if (documentType) filter.push(`documentType=${documentType}`);
    if (expirationdateend)
      filter.push(`expirationdateend=${expirationdateend}`);
    if (expirationdatenextperiod)
      filter.push(`expirationdatenextperiod=${expirationdatenextperiod}`);
    return filter;
  };

  const handleLoadGeneral = useCallback(async (filters: ICashFlowFilters) => {
    const query: string[] = getFilters(filters);
    try {
      const response = await api.get(
        `financialmovement/cash-flow/balance?${query.join('&')}`,
      );
      setDataGeneral(response.data);
    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoadingProgress(false);
    }
  }, []);

  const loadTabData = async (currency: string, filters: ICashFlowFilters) => {
    const existingData = cashFlowData[currency];
    const currentAllRows = allRowsMap[currency];

    if (existingData.length >= currentAllRows && currentAllRows > 0) return;
    setLoadingTabs(prev => ({ ...prev, [currency]: true }));

    try {
      const query: string[] = getFilters(filters);
      query.push(`skip=${existingData.length}`);
      query.push(`limit=20`);

      const response = await api.get(
        `financialmovement/cash-flow/position/${currency}?${query.join('&')}`,
      );
      setCashFlowData(prev => ({
        ...prev,
        [currency]: [...prev[currency], ...response.data.rows],
      }));
      setAllRowsMap(prev => ({ ...prev, [currency]: response.data.allRows }));
    } catch (e) {
      console.error(`Erro ao carregar ${currency}:`, e);
    } finally {
      setLoadingTabs(prev => ({ ...prev, [currency]: false }));
    }
  };

  const onRefreshData = useCallback(
    async (filters: ICashFlowFilters) => {
      await handleLoadGeneral(filters);
      setCashFlowData({ R$: [], US$: [] });
      setAllRowsMap({ R$: -1, US$: -1 });
      await loadTabData('R$', filters);
      await loadTabData('US$', filters);

      // Atualiza os filtros individuais
      setOperationFilter(filters?.operation);
      setStatusFilter(filters?.status);
      setDocumentTypeFilter(filters?.documentType);
      setProducerFilter(filters?.producer);
      setExpirationDateEndFilter(filters?.expirationdateend);
      setExpirationDateNextPeriodFilter(filters?.expirationdatenextperiod);

      // Atualiza o estado de filtros atual para ser passado aos componentes filhos
      setCurrentFilters(filters);

      setReload(false);
    },
    [handleLoadGeneral],
  );

  const initilization = async () => {
    const initialFilters = {
      operation: operationFilter,
      status: statusFilter,
      documentType: documentTypeFilter,
      producer: producerFilter,
      expirationdateend: expirationDateEndFilter,
      expirationdatenextperiod: expirationDateNextPeriodFilter,
    };

    await onRefreshData(initialFilters);
    setCurrentFilters(initialFilters);
  };

  const handleFilter = useCallback(
    async (filters?: ICashFlowFilters) => {
      await onRefreshData({
        operation: filters?.operation,
        status: filters?.status,
        documentType: filters?.documentType,
        producer: filters?.producer,
        expirationdateend: filters?.expirationdateend,
        expirationdatenextperiod: filters?.expirationdatenextperiod,
      });
    },
    [onRefreshData],
  );

  useEffect(() => {
    initilization();
  }, []);

  return (
    <>
      <Header showBackButton />
      <Container>
        <SectionGeneral>
          <ContainerContractPosition>
            {loadingProgress ? (
              <Loading />
            ) : (
              <>
                <Row justifyContent="center">
                  <TextBold>{dataGeneral.title}</TextBold>
                </Row>
                <Row>
                  <Flex />
                  <Flex>
                    <TextBold size={12}>Recebimento</TextBold>
                  </Flex>
                  <Flex>
                    <TextBold size={12}>Pagamento</TextBold>
                  </Flex>
                  <Flex>
                    <TextBold size={12}>Saldo</TextBold>
                  </Flex>
                </Row>
                <Row justifyContent="space-between" marginTop={6}>
                  <Flex>
                    <TextBold
                      size={11}
                    >{`${dataGeneral.currencyName} (${dataGeneral.currency})`}</TextBold>
                  </Flex>
                  <Flex justifyContent="flex-end">
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.income || 0,
                        dataGeneral.currency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                  <Flex justifyContent="flex-end">
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.expense || 0,
                        dataGeneral.currency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                  <Flex justifyContent="flex-end">
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.balance || 0,
                        dataGeneral.currency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                </Row>
                <Row justifyContent="space-between" marginTop={6}>
                  <Flex>
                    <TextBold size={11}>
                      {dataGeneral.alternativeCurrencyName}
                    </TextBold>
                  </Flex>
                  <Flex justifyContent="flex-end">
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.alternativeIncome || 0,
                        dataGeneral.alternativeCurrency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                  <Flex justifyContent="flex-end">
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.alternativeExpense || 0,
                        dataGeneral.alternativeCurrency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                  <Flex justifyContent="flex-end">
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.alternativeBalance || 0,
                        dataGeneral.alternativeCurrency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                </Row>
                <Row
                  justifyContent="space-between"
                  alignItems="center"
                  marginTop={6}
                >
                  <Flex>
                    <TextBold
                      size={11}
                    >{`SALDO (${dataGeneral.currency})`}</TextBold>
                    <TextBold
                      size={11}
                    >{`PTAX (${dataGeneral.ptax})`}</TextBold>
                  </Flex>
                  <Flex>
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.finalIncome || 0,
                        dataGeneral.currency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                  <Flex>
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.finalExpense || 0,
                        dataGeneral.currency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                  <Flex>
                    <TextRegular size={11}>
                      {convertCurrency(
                        dataGeneral.finalBalance || 0,
                        dataGeneral.currency,
                        false,
                        false,
                      )}
                    </TextRegular>
                  </Flex>
                </Row>
              </>
            )}
          </ContainerContractPosition>
        </SectionGeneral>
        <Flex>
          <Tab.Navigator
            screenOptions={{
              tabBarStyle: { backgroundColor: Colors.ecoop.darkGray },
              tabBarLabelStyle: {
                fontWeight: 'bold',
                width: '100%',
                textAlign: 'center',
                fontSize: normalize(12),
              },
              tabBarActiveTintColor: '#FFF',
              tabBarInactiveTintColor: '#ADADAD',
              tabBarIndicatorStyle: {
                marginBottom: 4,
                backgroundColor: '#FFF',
              },
            }}
            initialRouteName="REAL"
          >
            <Tab.Screen name="REAL">
              {() => (
                <TabCashFlow
                  ref={realTabRef}
                  currency="R$"
                  data={cashFlowData['R$']}
                  filters={currentFilters}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="DOLAR">
              {() => (
                <TabCashFlow
                  ref={dollarTabRef}
                  currency="US$"
                  data={cashFlowData['US$']}
                  filters={currentFilters}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </Flex>
      </Container>
      <FilterModalCashFlow ref={modalRef} onHandleFilters={handleFilter} />
      <FloatingButton
        filterCount={modalRef.current?.filterCount || 0}
        open={modalRef.current?.openModal}
      />
    </>
  );
};

export default CashFlow;
