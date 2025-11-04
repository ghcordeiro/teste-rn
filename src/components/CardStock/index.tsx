import React, { useRef } from 'react';
import Colors from '@colors';
import { TextLight } from '@globalStyle';
import ModalCardStock, {
  IModalCardStockProps
} from '@components/ModalCardStock';
import IStockProps from '../../dtos/stock';

import { Container, Header, Body } from './styles';

interface ICardStock {
  data: IStockProps;
}

const CardStock = ({ data }: ICardStock) => {
  const modalRef = useRef<IModalCardStockProps>(null);

  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };

  return (
    <>
      <Container key={data.productId.toString()} onPress={handleOpenModal}>
        <Header>
          <TextLight
            numberOfLines={1}
            adjustsFontSizeToFit
            size={18}
            color={Colors.white}>
            {data.name}
          </TextLight>
        </Header>
        <Body>
          <TextLight
            width="75%"
            numberOfLines={2}
            adjustsFontSizeToFit
            size={18}>
            {data.activePrinciple}
          </TextLight>
          <TextLight
            size={18}>{`${data.quantity} ${data.measurementUnit}`}</TextLight>
        </Body>
      </Container>
      <ModalCardStock ref={modalRef} stock={data} />
    </>
  );
};

export default CardStock;
