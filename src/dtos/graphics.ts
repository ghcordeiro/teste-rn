export interface IGraphData {
  key: number | string;
  amount: number;
  svg: {
    fill: string;
  };
}

export interface IGraphSubtitle {
  label: string;
  color: string;
}

interface ICardGraphValueProps {
  value: number;
  prefix: string;
  color: string;
  icon?: string;
  iconSize?: number;
}

export interface ICardGraphProps {
  title: string;
  values: Array<ICardGraphValueProps>;
}

// export interface ICardGraphData {
//   data: Array<ICardGraphProps>;
// }

export interface ISalesPosition {
  crop: string;
  culture: string;
  sold: number;
  delivered: number;
  measurementUnit: string;
}

export interface ICardGraphData {
  crop: string;
  culture: string;
  avgCooperativePrice: number;
  avgPrice: number;
  currency: string;
  avgCooperativeAlternativePrice: number;
  avgAlternativePrice: number;
  alternativeCurrency: string;
  efficiency: number;
  alternativeEfficiency: number;
}
