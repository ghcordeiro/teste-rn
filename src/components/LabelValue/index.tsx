import { TextBold, TextRegular } from '@globalStyle';
import React from 'react';

interface ILabelValueProps {
  label: string;
  value: any;
  fontSize?: number;
}

export function LabelValue({ label, value, fontSize }: ILabelValueProps) {
  return (
    <>
      <TextBold size={fontSize || 16}>{label}</TextBold>
      <TextRegular size={fontSize ? fontSize - 1 : 14}>{value}</TextRegular>
    </>
  );
}
