import Colors from '@colors';
import { darken } from 'polished';
import { ICardGraphData } from 'src/dtos/graphics';

export function mountData(data: ICardGraphData) {
  return {
    firstLine: [
      {
        title: 'Cooperado',
        values: [
          {
            value: data.avgPrice,
            prefix: data.currency,
            color:
              data.avgPrice >= data.avgCooperativePrice
                ? darken(0.1, Colors.ecoop.primary)
                : darken(0.1, Colors.ecoop.secondary),
            icon:
              data.avgPrice >= data.avgCooperativePrice
                ? 'trending-up-outline'
                : 'trending-down-outline',
            iconSize: 24
          },
          {
            value: data.avgAlternativePrice,
            prefix: data.alternativeCurrency,
            color:
              data.avgAlternativePrice >= data.avgCooperativeAlternativePrice
                ? darken(0.1, Colors.ecoop.primary)
                : darken(0.1, Colors.ecoop.secondary),
            icon:
              data.avgAlternativePrice >= data.avgCooperativeAlternativePrice
                ? 'trending-up-outline'
                : 'trending-down-outline',
            iconSize: 24
          }
        ]
      },
      {
        title: 'Cooperativa',
        values: [
          {
            value: data.avgCooperativePrice,
            prefix: data.currency,
            color: darken(0.1, Colors.ecoop.darkGray)
          },
          {
            value: data.avgCooperativeAlternativePrice,
            prefix: data.alternativeCurrency,
            color: darken(0.1, Colors.ecoop.darkGray)
          }
        ]
      }
    ],
    secondLine: [
      {
        title: 'Real (R$)',
        values: [
          {
            value: Math.ceil(data.efficiency),
            prefix: '%',
            color:
              data.efficiency >= 0
                ? darken(0.1, Colors.ecoop.primary)
                : darken(0.1, Colors.ecoop.secondary),
            icon:
              data.efficiency >= 0
                ? 'trending-up-outline'
                : 'trending-down-outline',
            iconSize: 24
          }
        ]
      },
      {
        title: 'Dolar ($)',
        values: [
          {
            value: Math.ceil(data.alternativeEfficiency),
            prefix: '%',
            color:
              data.alternativeEfficiency >= 0
                ? darken(0.1, Colors.ecoop.primary)
                : darken(0.1, Colors.ecoop.secondary),
            icon:
              data.alternativeEfficiency >= 0
                ? 'trending-up-outline'
                : 'trending-down-outline',
            iconSize: 24
          }
        ]
      }
    ]
  };
}
