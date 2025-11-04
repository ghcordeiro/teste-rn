/* eslint-disable no-underscore-dangle */
import Colors from '@colors';
import Loading from '@components/Loading';
import { Divider, Row, TextBold, TextLight } from '@globalStyle';
import { normalize } from '@size';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { IInvoice, IInvoiceItem } from 'src/dtos/contract';
import api from 'src/services/api';

import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import returnContractType, { ITypeDefinition } from '@utils/returnContractType';
import { Header, ModalContainer } from './styles';

export interface IModalCardDetailsNFProps {
  openModal: () => void;
  closeModal: () => void;
}

export interface ReciveProps {
  invoice: IInvoice;
  contractId: string;
}

const ModalCardDetailsNF: React.ForwardRefRenderFunction<
  IModalCardDetailsNFProps,
  ReciveProps
> = ({ invoice, contractId }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<IInvoiceItem>({} as IInvoiceItem);
  const [typeContract, setTypeContract] = useState<
    ITypeDefinition | undefined
  >();

  const loadRepositories = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `salescontract/get/${contractId}/invoice/${invoice._id}`
      );
      setData(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const openModal = useCallback(async () => {
    setLoading(true);
    await loadRepositories();
    setVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    };
  });

  useEffect(() => {
    setTypeContract(returnContractType(data.type));
  }, [data.type]);

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
      shouldRasterizeIOS>
      <ModalContainer>
        <Header>
          <FAIcon
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
            marginLeft={8}>
            NF {invoice.invoice}
          </TextLight>
        </Header>
        {loading ? (
          <Loading />
        ) : (
          <View style={{ paddingHorizontal: 8, marginVertical: 16 }}>
            <Row justifyContent="space-between">
              <TextLight>Modalidade</TextLight>
              <TextBold>
                {`${typeContract?.initials} - ${typeContract?.description}`}
              </TextBold>
            </Row>
            <Row justifyContent="space-between">
              <TextLight>Emissão</TextLight>
              <TextBold>
                {convertData(new Date(data.dateOf).getTime(), '/')}
              </TextBold>
            </Row>
            <Row justifyContent="space-between">
              <TextLight>Vencimento</TextLight>
              <TextBold>
                {convertData(new Date(data.expirationDate).getTime(), '/')}
              </TextBold>
            </Row>
            <Row justifyContent="space-between">
              <TextLight>Cond. Pagamento</TextLight>
              <TextBold>{data.paymentTerm}</TextBold>
            </Row>
            <Divider />
            <Row justifyContent="space-between">
              <TextLight>Total</TextLight>
              <TextBold>{convertCurrency(data.amount, data.currency)}</TextBold>
            </Row>
            {data.alternativeCurrency && (
              <>
                <Divider />
                <Row justifyContent="space-between">
                  <TextLight>PTAX</TextLight>
                  <TextBold>
                    {convertCurrency(data.ptax, data.alternativeCurrency)}
                  </TextBold>
                </Row>
                <Row justifyContent="space-between">
                  <TextLight>Preço</TextLight>
                  <TextBold>
                    {convertCurrency(data.price, data.alternativeCurrency)}
                  </TextBold>
                </Row>
                <Row justifyContent="space-between">
                  <TextLight>Valor</TextLight>
                  <TextBold>
                    {convertCurrency(
                      data.amount / data.ptax,
                      data.alternativeCurrency
                    )}
                  </TextBold>
                </Row>
              </>
            )}
          </View>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default forwardRef(ModalCardDetailsNF);
