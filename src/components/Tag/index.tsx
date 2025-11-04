import { TextRegular } from '@globalStyle';
import React from 'react';
import { View } from 'react-native';

interface ITagProps {
  title: string;
}

export const Tag = ({ title }: ITagProps) => {
  return (
    <View>
      <TextRegular>{title}</TextRegular>
    </View>
  );
};
