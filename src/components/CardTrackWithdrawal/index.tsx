import Colors from '@colors';
import { Row, TextLight, TextRegular } from '@globalStyle';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

import ModalTrackWithdrawal, {
  IModalTrackWithdrawalProps
} from '@components/ModalTrackWithdrawal';
import { EDeliveryOrderStatus } from '@enum/EDeliveryOrderStatus';
import convertData from '@utils/convertData';
import DiffData from '@utils/DiffData';
import { IDeliveryOrder } from 'src/features/withdrawals';
import { Body, BodyGroupText, Container, Header } from './styles';

interface ICardTrackWithdrawal {
  data: IDeliveryOrder;
}

export interface ReciveProps {
  openModal: () => void;
}

const CardTrackWithdrawal: React.ForwardRefRenderFunction<
  ReciveProps,
  ICardTrackWithdrawal
> = ({ data }: ICardTrackWithdrawal, ref) => {
  const modalRef = useRef<IModalTrackWithdrawalProps>(null);

  const handleOpenModal = () => {
    modalRef.current?.openModal(data.key);
  };

  useImperativeHandle(ref, () => {
    return {
      openModal() {
        handleOpenModal();
      }
    };
  });

  return (
    <>
      <Container key={data.key.toString()} onPress={handleOpenModal}>
        <Header>
          <TextLight
            numberOfLines={1}
            adjustsFontSizeToFit
            size={18}
            color={Colors.white}>
            Solicitação {data.code}
          </TextLight>
        </Header>
        <Body>
          <Row>
            <BodyGroupText>
              <TextRegular size={15} numberOfLines={1}>
                {`Status: ${EDeliveryOrderStatus[data.status]}`}
              </TextRegular>
            </BodyGroupText>
          </Row>
          <Row>
            <BodyGroupText>
              <TextRegular size={15} numberOfLines={1}>
                {`Data abertura: ${convertData(
                  new Date(data.dateOf).getTime(),
                  '/',
                  true
                )}`}
              </TextRegular>
            </BodyGroupText>
          </Row>
          <Row>
            <BodyGroupText>
              <TextRegular size={15} numberOfLines={1}>
                Tempo em aberto: {DiffData(new Date(data.dateOf).getTime())}
              </TextRegular>
            </BodyGroupText>
          </Row>
          {/* <Row justifyContent="space-between">
            <BodyGroupText>
              <TextRegular size={12}>Estoque</TextRegular>
              <TextRegular size={15}>{`${convertAfterDot(data., 2)} ${data.measurementUnit
                }`}</TextRegular>
            </BodyGroupText>
            <BodyGroupText>
              <TextRegular size={12}>Estoque Disponível</TextRegular>
              <TextRegular size={15}>{`${convertAfterDot(
                data.withdrawalBalance || 0,
                2
              )} ${data.measurementUnit}`}</TextRegular>
            </BodyGroupText>
          </Row> */}
        </Body>
      </Container>
      <ModalTrackWithdrawal ref={modalRef} />
    </>
  );
};

export default forwardRef(CardTrackWithdrawal);
