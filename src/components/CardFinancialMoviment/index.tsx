/* eslint-disable react-native/no-inline-styles */
import Colors from '@colors';
import {Flex, Row, TextBold, TextLight} from '@globalStyle';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import returnFinancialMovimentCard from '@utils/returnFinancialMovimentCard';
import React from 'react';
import EFinancialStatementOperation from 'src/enum/EFinancialStatementOperation';
import IFinancialMoviment from '../../dtos/financialMoviment';

import {Body, Container, ContainerStatus, Header} from './styles';

interface ICardProps {
  data: IFinancialMoviment;
  index: number;
}

const CardFinancialMoviment = ({data}: ICardProps) => {
  const status = returnFinancialMovimentCard(data.status);
  /*
  const returnContainerStatus = () => {
    const status = returnFinancialMovimentCard(data.status);

    return (
      <ContainerStatus backgoundColor={status?.color || Colors.info.info_1}>
        <TextBold
          size={13}
          color={Colors.white}
          textAlign="center"
          width="100%">
          {status?.description}
        </TextBold>
      </ContainerStatus>
    );
  };
  */
  return (
    <Container key={data._id}>
      <Header>
        <TextBold
          numberOfLines={1}
          //adjustsFontSizeToFit
          size={18}
          color={Colors.white}>
          {`${data?.documentType} ${data?.document} ${
            data?.counterparty ? `- ${data?.counterparty}` : ''
          }`}
        </TextBold>
      </Header>
      <Body>
        {data.producerName ? (
          <Row>
            <Flex
              style={{
                flexDirection: 'row',
                flexWrap: 'nowrap',
                overflow: 'hidden',
              }}
              alignItems="flex-end"
              justifyContent="center"
              marginBottom={4}>
              <TextBold
                size={14}
                // backgroundColor="red"
                textAlign="left"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{flexShrink: 1, flexGrow: 1, minWidth: 0}}>
                {`${data.producerName}`}
              </TextBold>
            </Flex>
          </Row>
        ) : null}
        <Row>
          <Flex alignItems="flex-start" justifyContent="center">
            <TextLight size={13}>Vencimento</TextLight>
            <TextBold size={14}>
              {convertData(
                new Date(data.expirationDate).getTime(),
                '/',
                false,
                'full',
              )}
            </TextBold>
          </Flex>
          <Flex alignItems="center" justifyContent="center">
            <TextLight size={13}>Emissão</TextLight>
            <TextBold size={14}>
              {convertData(new Date(data.dateOf).getTime(), '/', false, 'full')}
            </TextBold>
          </Flex>
          <Flex alignItems="flex-end" justifyContent="center">
            <TextLight size={13}>Pagamento</TextLight>
            {data.paymentDate ? (
              <>
                <TextBold size={14} marginBottom={4} textAlign="left">
                  {convertData(
                    new Date(data.paymentDate).getTime(),
                    '/',
                    false,
                    'full',
                  )}
                </TextBold>
              </>
            ) : null}
          </Flex>
        </Row>
        <Row marginTop={12}>
          <Flex alignItems="flex-start" justifyContent="center">
            <>
              {data?.alternativeCurrency && data?.ptax ? (
                <>
                  <TextLight marginBottom={6} size={13} textAlign="center">
                    {'PTAX: '}
                    <TextBold size={14} textAlign="center">
                      {`${convertCurrency(
                        data?.ptax,
                        data?.alternativeCurrency,
                      )}`}
                    </TextBold>
                  </TextLight>
                </>
              ) : (
                <></>
              )}
            </>
            {status?.description && (
              <ContainerStatus
                backgoundColor={status?.color || Colors.info.info_1}>
                <TextBold size={13} color={Colors.white}>
                  {status.description}
                </TextBold>
              </ContainerStatus>
            )}
          </Flex>
          <Flex alignItems="flex-end" justifyContent="center">
            <Flex alignItems="flex-end" justifyContent="flex-end">
              <TextBold
                size={14}
                textAlign="right"
                color={
                  data.operation === EFinancialStatementOperation.CREDIT
                    ? Colors.success.success_1
                    : Colors.danger.danger_1
                }>
                {`${convertCurrency(data.amount, data.currency)}`}
              </TextBold>
              <TextBold
                size={14}
                marginTop={4}
                textAlign="right"
                color={
                  data.operation === EFinancialStatementOperation.CREDIT
                    ? Colors.success.success_1
                    : Colors.danger.danger_1
                }>
                {data.alternativeCurrency && data.alternativeAmount
                  ? `${convertCurrency(
                      data.alternativeAmount,
                      data.alternativeCurrency,
                    )}`
                  : ''}
              </TextBold>
            </Flex>
          </Flex>
        </Row>
      </Body>
    </Container>
  );
};

export default CardFinancialMoviment;
