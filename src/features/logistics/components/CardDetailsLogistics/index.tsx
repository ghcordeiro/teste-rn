import React, { useRef } from 'react';
import { Row, TextRegular } from '@globalStyle';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';

import returnContractType from '@utils/returnContractType';
import { ITicket } from '../../types/logistics';
import { Container } from './styles';
import ModalCardDetailsNF, {
  IModalCardDetailsLogsticsProps
} from '../ModalCardDetailsLogistics';
import ModalCardDetailsLogistics from '@components/ModalCardDetailsLogistics';
import convertHours from '@utils/convertHours';
import { ELogisticsStatus } from '@enum/ELogisticsStatus';

interface ICardProps {
  data: ITicket;
  index: number;
  contractId: string;
}

const CardDetailsLoistics = ({ data, index, contractId }: ICardProps) => {
  const modalRef = useRef<IModalCardDetailsLogsticsProps>(null);
  const textSize = 14;
 
  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };
  return (
    <>
      <Container key={`${data._id}-${index}`} onPress={handleOpenModal}>
        <Row alignItems='center' justifyContent='space-between'>
          <TextRegular size={textSize}>
            {`${data.plate} / ${data.document}`}
          </TextRegular>
          <TextRegular textAlign="center" size={textSize}>
            {data.quantity} {data.measurementUnit}
          </TextRegular>
        </Row>
        <Row alignItems='center' justifyContent='space-between' marginTop={8}>
          <TextRegular size={textSize}>
            {`${ELogisticsStatus[data.step]}`}
          </TextRegular>
          <TextRegular textAlign="center" size={textSize} skipTranslation>
            {`${convertHours(data.timeStep)} `}
            <TextRegular translationKey="hours" />
          </TextRegular>
        </Row>
        <Row alignItems='center' justifyContent='space-between' marginTop={8}>
          <TextRegular size={textSize} translationKey="totalTime" />
          <TextRegular textAlign="center" size={textSize} skipTranslation>
            {`${convertHours(data.timeAll)} `}
            <TextRegular translationKey="hours" />
          </TextRegular>
        </Row>
      </Container>
      <ModalCardDetailsLogistics
        ref={modalRef}
        ticket={data}
      />
    </>
  );
};

export default CardDetailsLoistics;
