import Colors from '@colors';
import { Flex, Row, TextBold, TextLight } from '@globalStyle';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import React from 'react';
import EFinancialStatementOperation from 'src/enum/EFinancialStatementOperation';
import IFinancialMoviment from '../../dtos/financialMoviment';

import { Body, Container, Header } from './styles';

interface ICardProps {
  data: IFinancialMoviment;
  index: number;
}

const CardFinancialMovimentModalCashFlow = ({data}: ICardProps) => {
  return (
    <Container key={data._id}>
      <Header>
        <TextBold
          numberOfLines={1}
          //adjustsFontSizeToFit
          size={14}
          color={Colors.white}>
          {`${data?.documentType} ${data?.document} ${
            data?.counterparty ? `- ${data?.counterparty}` : ''
          }`}
        </TextBold>
      </Header>
      <Body>
        {data.producerName ? (
          <Row>
            <Flex justifyContent="center" marginBottom={4}>
              <TextBold
                size={13}
                textAlign="left"
                numberOfLines={1}
                ellipsizeMode="tail">
                {`${data.producerName}`}
              </TextBold>
            </Flex>
          </Row>
        ) : null}
        <Row>
          <Flex alignItems="center" justifyContent="center" flex={1}>
            <TextLight size={11}>Vencimento</TextLight>
            <TextBold size={13}>
              {convertData(new Date(data.expirationDate).getTime(), '/')}
            </TextBold>
          </Flex>
          <Flex alignItems="center" justifyContent="center" flex={2}>
            <TextLight size={12}>Valor</TextLight>
            <TextBold
              size={13}
              textAlign="right"
              color={
                data.operation === EFinancialStatementOperation.CREDIT
                  ? Colors.success.success_1
                  : Colors.danger.danger_1
              }>
              {`${convertCurrency(data.amount, data.currency)}`}
            </TextBold>
          </Flex>
          <Flex alignItems="center" justifyContent="center" flex={2}>
            <TextLight size={12}>Saldo</TextLight>
            <TextBold
              size={13}
              textAlign="right"
              color={
                data.operation === EFinancialStatementOperation.CREDIT
                  ? Colors.success.success_1
                  : Colors.danger.danger_1
              }>
              {`${convertCurrency(data.balance, data.currency)}`}
            </TextBold>
          </Flex>
        </Row>
      </Body>
    </Container>
  );
};

export default CardFinancialMovimentModalCashFlow;
