import { Flex, Row, TextRegular } from '@globalStyle';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import React, { useRef } from 'react';

import { ModalCardDetailsCashFlow, ICashFlowResume, ICashFlowFilters } from '../..';
import { IModalCardDetailsCashFlowProps } from '../ModalCardDetailsCashFlow';
import { Container } from './styles';

interface ICardProps {
  data: ICashFlowResume;
  index: number;
  filters: ICashFlowFilters; // Adicionando os filtros como prop
}

const CardCashFlow = ({data, index, filters}: ICardProps) => {
  const modalRef = useRef<IModalCardDetailsCashFlowProps>(null);

  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };
  
  return (
    <>
      <Container key={`${data.key}-${index}`} onPress={handleOpenModal}>
        <Row>
          <Flex flex={1}>
            <TextRegular textAlign="left" size={11}>
              {convertData(new Date(data.date).getTime(), '/')}
            </TextRegular>
          </Flex>
          <Flex flex={2}>
            <TextRegular textAlign="right" size={11}>
              {convertCurrency(data.income, data.currency, false, false)}
            </TextRegular>
          </Flex>
          <Flex flex={2}>
            <TextRegular textAlign="right" size={11}>
              {convertCurrency(data.expense, data.currency, false, false)}
            </TextRegular>
          </Flex>
          <Flex flex={2}>
            <TextRegular textAlign="right" size={11}>
              {convertCurrency(data.balance, data.currency, false, false)}
            </TextRegular>
          </Flex>
        </Row>
      </Container>
      {/* Passando os filtros para o ModalCardDetailsCashFlow */}
      <ModalCardDetailsCashFlow ref={modalRef} chave={data.key} filters={filters} />
    </>
  );
};

export default CardCashFlow;
