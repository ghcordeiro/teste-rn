import React from 'react';
import { BadgeTxt, Icon, InnerContainer } from './styles';

interface IIconWithCountProps {
  icon: string;
  count: number;
  action: () => void;
  color?: string;
}

export function IconWithCount({
  count,
  icon,
  action,
  color
}: IIconWithCountProps) {
  return (
    <>
      <Icon
        count={count}
        name={icon}
        size={24}
        color={color}
        onPress={() => {
          action();
        }}
      />
      {count > 0 && (
        <InnerContainer>
          <BadgeTxt>{count || 0}</BadgeTxt>
        </InnerContainer>
      )}
    </>
  );
}
