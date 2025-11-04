import { IconWithCount } from '@components/IconWithCount';
import React from 'react';
import { ContainerFilter } from './styles';

interface FlotingButtonProps {
  open?: () => void;
  filterCount: number;
}

const FloatingButton = ({
  open = () => {},
  filterCount
}: FlotingButtonProps) => {
  return (
    <ContainerFilter
      onPress={() => {
        open();
      }}>
      <IconWithCount action={open} count={filterCount} icon="filter" />
    </ContainerFilter>
  );
};

export default FloatingButton;
