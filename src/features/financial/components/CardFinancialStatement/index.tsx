/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Colors from '@colors';
import { Row } from '@globalStyle';
import convertDiaMesAno from '@utils/convertDiaMesAno';
import convertCurrency from '@utils/convertCurrency';
import EFinancialStatementOperation from '@enum/EFinancialStatementOperation';
import IFinancialStatement from '../../types/financialStatement';
import { TextData, TextLight, TextRegular } from './styles';

interface ICardProps {
  data: IFinancialStatement;
  index: number;
}

const CardFinancialStatement = ({ data, index }: ICardProps) => {
  // const modalRef = useRef<IModalCardStockProps>(null);
  return (
    <>
      <Row
        key={`statement-${data.dateOf}-${data.description}-${data.amount}-${index}`}
        justifyContent="space-between"
        alignItems="center"
        paddingLeft={8}
        paddingRight={8}
        paddingTop={6}
        paddingBottom={6}
        flex={1}
        backgroundColor={index % 2 === 0 ? '#ffffff' : undefined}>
        <TextData textAlign="left" size={14}>
          {convertDiaMesAno(data.dateOf, 'daymonthyear')}
        </TextData>
        <TextLight
          textAlign="left"
          numberOfLines={3}
          marginLeft={6}
          size={14}>{`${data.description}`}</TextLight>
        <TextRegular
          textAlign="right"
          size={14}
          color={
            data.operation === EFinancialStatementOperation.CREDIT
              ? Colors.success.success_1
              : Colors.danger.danger_1
          }>
          {convertCurrency(data.amount, data.currency)}
        </TextRegular>
      </Row>
    </>
  );
};

export default CardFinancialStatement;
