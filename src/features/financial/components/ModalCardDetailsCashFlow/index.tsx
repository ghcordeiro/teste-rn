import Colors from '@colors';
import { CenteredFlex, TextLight, TextRegular } from '@globalStyle';
import { normalize } from '@size';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { FlatList, Platform, View } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import api from 'src/services/api';
import { Loading } from 'src/shared';

import { translate } from '@translate';
import {
  CardFinancialMovimentModalCashFlow,
  ICashFlowFilters,
  IFinancialMoviment,
} from 'src/features/financial';
import { Container, Header, ModalContainer } from './styles';

export interface IModalCardDetailsCashFlowProps {
  openModal: () => void;
  closeModal: () => void;
}

export interface ReciveProps {
  chave: string;
  filters?: ICashFlowFilters; // Adicionando os filtros como prop opcional
}

const ModalCardDetailsCashFlow: React.ForwardRefRenderFunction<
  IModalCardDetailsCashFlowProps,
  ReciveProps
> = ({ chave, filters }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef(null);

  const [limit] = useState(20);
  const [allRows, setAllRows] = useState(-1);
  const [data, setData] = useState<Array<IFinancialMoviment>>(
    [] as Array<IFinancialMoviment>,
  );

  // Função auxiliar para construir a query com os filtros
  const getFiltersQuery = (filters?: ICashFlowFilters): string => {
    if (!filters) return '';

    const queryParams: string[] = [];

    if (filters.operation) queryParams.push(`operation=${filters.operation}`);
    if (filters.status && filters.status.length > 0)
      queryParams.push(`status=${filters.status}`);
    if (filters.documentType)
      queryParams.push(`documentType=${filters.documentType}`);
    if (filters.producer)
      queryParams.push(`producer=${filters.producer || 'ALL'}`);
    if (filters.expirationdateend)
      queryParams.push(`expirationdateend=${filters.expirationdateend}`);
    if (filters.expirationdatenextperiod)
      queryParams.push(
        `expirationdatenextperiod=${filters.expirationdatenextperiod}`,
      );

    return queryParams.length > 0 ? `&${queryParams.join('&')}` : '';
  };

  const handleLoad = useCallback(async () => {
    try {
      setLoading(true);

      if (data.length >= allRows && allRows > 0) {
        setLoading(false);
        return;
      }

      // Construindo a URL com os filtros
      const filtersQuery = getFiltersQuery(filters);
      const url = `financialmovement/cash-flow/position-detail/${chave}?skip=${data.length}&limit=${limit}${filtersQuery}`;

      const response = await api.get(url);

      setAllRows(response.data.allRows);
      setData([...data, ...response.data.rows]);
    } catch (e) {
      console.error('Erro ao carregar detalhes:', e);
    } finally {
      setLoading(false);
    }
  }, [data, allRows, chave, limit, filters]);

  const openModal = useCallback(async () => {
    setLoading(true);
    // Limpa os dados anteriores antes de abrir o modal
    setData([]);
    setAllRows(-1);
    await handleLoad();
    setVisible(true);
  }, [handleLoad]);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal,
    };
  });

  const listEmptyComponent = () => (
    <CenteredFlex>
      <TextRegular size={16}>{translate('commonNoItems')}</TextRegular>
    </CenteredFlex>
  );

  const renderItem = (item: IFinancialMoviment, index: number) => (
    <Container>
      <CardFinancialMovimentModalCashFlow
        key={item._id || `cashflow-${index}`}
        data={item}
        index={index}
      />
      {index === data.length - 1 ? (
        <View style={{ height: 32, width: '100%' }} />
      ) : null}
    </Container>
  );

  return (
    <Modal
      isVisible={visible}
      backdropColor="#3b3b3b"
      backdropOpacity={0.9}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      shouldRasterizeIOS
    >
      <ModalContainer>
        <Header>
          <FontAwesome
            name="truck"
            color={Colors.white}
            size={normalize(18)}
            style={{ transform: [{ rotateY: '180deg' }] }}
          />
          <TextLight
            numberOfLines={1}
            adjustsFontSizeToFit
            size={18}
            color={Colors.white}
            marginLeft={8}
          >
            Movimentos
          </TextLight>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <>
            <FlatList
              ref={listRef}
              data={data}
              keyExtractor={(item, index) => `${item.document}-${index}`}
              style={{
                marginBottom: Platform.OS === 'android' ? 64 : 16,
                marginTop: Platform.OS === 'android' ? 16 : 8,
                paddingHorizontal: 8,
              }}
              renderItem={({ item, index }) => renderItem(item, index)}
              ListEmptyComponent={listEmptyComponent}
            />
          </>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default forwardRef(ModalCardDetailsCashFlow);
