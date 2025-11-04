import EFinancialMovementStatus from '@enum/EFinancialMovementStatus';
import EFinancialStatementOperation from '@enum/EFinancialStatementOperation';
import React, { useState } from 'react';
import { IFilterSituationProps } from '..';
import { Button, ButtonFirst, Container, TextDescription } from './styles';

interface IFilters {
  onHandleFilters: (filters: IFilterSituationProps) => void;
}

const FilterSituation = ({ onHandleFilters }: IFilters) => {
  const [buttonStatusSelect, setButtonStatusSelect] =
    useState<EFinancialMovementStatus>(EFinancialMovementStatus.NONE);
  const [buttonOperationSelect, setButtonOperationSelect] =
    useState<EFinancialStatementOperation>(EFinancialStatementOperation.NONE);

  const filters: IFilterSituationProps = {
    operation: null,
    status: null
  };

  const updateFilters = (
    _buttonOperationSelect: EFinancialStatementOperation,
    _buttonStatusSelect: EFinancialMovementStatus
  ) => {

    if (
      _buttonOperationSelect === buttonOperationSelect &&
      _buttonOperationSelect !== EFinancialStatementOperation.NONE
    ) {
      setButtonOperationSelect(EFinancialStatementOperation.NONE);
      filters.operation = null;
      filters.status = buttonStatusSelect;
    }
    if (
      _buttonOperationSelect !== buttonOperationSelect &&
      _buttonOperationSelect !== EFinancialStatementOperation.NONE
    ) {
      setButtonOperationSelect(_buttonOperationSelect);
      filters.operation = _buttonOperationSelect;
      filters.status = buttonStatusSelect;
    }

    if (
      _buttonStatusSelect === buttonStatusSelect &&
      _buttonStatusSelect !== EFinancialMovementStatus.NONE
    ) {
      setButtonStatusSelect(EFinancialMovementStatus.NONE);
      filters.status = null;
      filters.operation = buttonOperationSelect;
    }
    if (
      _buttonStatusSelect !== buttonStatusSelect &&
      _buttonStatusSelect !== EFinancialMovementStatus.NONE
    ) {
      setButtonStatusSelect(_buttonStatusSelect);
      filters.status = _buttonStatusSelect;
      filters.operation = buttonOperationSelect;
    }

    onHandleFilters(filters);
  };

  return (
    <>
      <Container>
        <ButtonFirst
          activeOpacity={1}
          isFirst
          selected={buttonStatusSelect === EFinancialMovementStatus.OPEN}
          onPress={() =>
            updateFilters(
              EFinancialStatementOperation.NONE,
              EFinancialMovementStatus.OPEN
            )
          }>
          <TextDescription
            selected={buttonStatusSelect === EFinancialMovementStatus.OPEN}>
            Aberto
          </TextDescription>
        </ButtonFirst>
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={buttonStatusSelect === EFinancialMovementStatus.PAID}
          onPress={() =>
            updateFilters(
              EFinancialStatementOperation.NONE,
              EFinancialMovementStatus.PAID
            )
          }>
          <TextDescription
            selected={buttonStatusSelect === EFinancialMovementStatus.PAID}>
            Liquidado
          </TextDescription>
        </Button>
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={buttonStatusSelect === EFinancialMovementStatus.PARTIALPAID}
          onPress={() =>
            updateFilters(
              EFinancialStatementOperation.NONE,
              EFinancialMovementStatus.PARTIALPAID
            )
          }>
          <TextDescription
            selected={
              buttonStatusSelect === EFinancialMovementStatus.PARTIALPAID
            }>
            Parcial
          </TextDescription>
        </Button>

        <Button
          activeOpacity={1}
          isFirst={false}
          selected={
            buttonOperationSelect === EFinancialStatementOperation.DEBIT
          }
          onPress={() =>
            updateFilters(
              EFinancialStatementOperation.DEBIT,
              EFinancialMovementStatus.NONE
            )
          }>
          <TextDescription
            selected={
              buttonOperationSelect === EFinancialStatementOperation.DEBIT
            }>
            Pagar
          </TextDescription>
        </Button>
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={
            buttonOperationSelect === EFinancialStatementOperation.CREDIT
          }
          onPress={() =>
            updateFilters(
              EFinancialStatementOperation.CREDIT,
              EFinancialMovementStatus.NONE
            )
          }>
          <TextDescription
            selected={
              buttonOperationSelect === EFinancialStatementOperation.CREDIT
            }>
            Receber
          </TextDescription>
        </Button>
      </Container>
    </>
  );
};

export default FilterSituation;
