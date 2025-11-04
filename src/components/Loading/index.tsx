import Colors from '@colors';
import { isNotNullAndUndefined } from '@utils/validation';
import React from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';

import { Container } from './styles';

interface ILoadingProps {
  color?: string;
  size?: 'large' | 'small';
  loading?: boolean;
}

const Loading: React.FC<ILoadingProps> = ({ color, size, loading }) => {
  return (
    <Container>
      {isNotNullAndUndefined(loading) ? (
        <RefreshControl refreshing={loading || false} />
      ) : (
        <ActivityIndicator
          color={color || Colors.primary.blue}
          size={size || 'large'}
        />
      )}
    </Container>
  );
};

export default Loading;
