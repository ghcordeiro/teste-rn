import { IconWithCount } from '@components/IconWithCount';
import React from 'react';
import { ContainerFilter } from './styles';

interface FlotingButtonProps {
  action?: () => void;
  filterCount: number;
  bottomSpace?: number;
}

const FloatingButton = ({
  action = () => {},
  filterCount,
  bottomSpace
}: FlotingButtonProps) => {
  return (
    <ContainerFilter
      onPress={() => {
        action();
      }}
      bottom={bottomSpace}>
      <IconWithCount action={action} count={filterCount} icon="plus" />
    </ContainerFilter>
  );
};

export default FloatingButton;
