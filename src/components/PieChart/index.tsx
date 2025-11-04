import Colors from '@colors';
import { TextBold, TextRegular } from '@globalStyle';
import * as shape from 'd3-shape';
import { darken } from 'polished';
import React, { useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, Platform, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { IGraphData, ISalesPosition } from 'src/dtos/graphics';
import { Loading } from 'src/shared';
import { Container, DotSubtitle, RowSubtitle, Subtitle } from './styles';

interface IGraphSubtitle {
  label: string;
  color: string;
}

interface IPieChartProps {
  loading: boolean;
  data: ISalesPosition;
}

interface IPieDataItem {
  key: string | number;
  amount: number;
  svg: { fill: string };
}

// Componente interno para renderizar o gráfico de pizza
interface IPieChartSvgProps {
  data: Array<IPieDataItem>;
  valueAccessor: (item: { item: IPieDataItem }) => number;
  children?: React.ReactNode;
  style?: object;
  innerRadius?: number | string;
  outerRadius?: number | string;
  padAngle?: number;
}

const PieChartSvg: React.FC<IPieChartSvgProps> = ({
  data,
  valueAccessor,
  children,
  style,
  innerRadius = '50%',
  outerRadius = '83%',
  padAngle = 0.05,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: { height, width },
      },
    } = event;
    setDimensions({ width, height });
  }, []);

  const calculateRadius = useCallback(
    (arg: number | string | undefined, max: number, defaultVal: number) => {
      if (typeof arg === 'string') {
        return (parseFloat(arg.replace('%', '')) / 100) * max;
      }
      if (typeof arg === 'number') {
        return arg;
      }
      return defaultVal;
    },
    [],
  );

  const { arcs, pieSlices } = useMemo(() => {
    if (
      data.length === 0 ||
      dimensions.width === 0 ||
      dimensions.height === 0
    ) {
      return { arcs: [], pieSlices: [] };
    }

    const maxRadius = Math.min(dimensions.width, dimensions.height) / 2;
    const _outerRadius = calculateRadius(outerRadius, maxRadius, maxRadius);
    const _innerRadius = calculateRadius(innerRadius, maxRadius, 0);

    // Calcular slices do pie primeiro
    // @ts-ignore - d3-shape tem tipagem incompatível com objetos complexos
    const pie = shape
      .pie()
      .value((d: any) => valueAccessor({ item: d as IPieDataItem }))
      .sort(
        (a: any, b: any) =>
          valueAccessor({ item: b as IPieDataItem }) -
          valueAccessor({ item: a as IPieDataItem }),
      )
      .startAngle(0)
      .endAngle(Math.PI * 2);
    // @ts-ignore - d3-shape tem tipagem incompatível com objetos complexos
    const slices = pie(data);

    // Criar arcos para cada slice
    const createdArcs = slices.map(() => {
      return shape
        .arc()
        .outerRadius(_outerRadius)
        .innerRadius(_innerRadius)
        .padAngle(padAngle);
    });

    return { arcs: createdArcs, pieSlices: slices };
  }, [
    data,
    dimensions,
    innerRadius,
    outerRadius,
    padAngle,
    valueAccessor,
    calculateRadius,
  ]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <View style={style} onLayout={handleLayout}>
        <View style={{ flex: 1 }} />
      </View>
    );
  }

  return (
    <View pointerEvents="box-none" style={style}>
      <View
        pointerEvents="box-none"
        style={{ flex: 1 }}
        onLayout={handleLayout}
      >
        <Svg
          pointerEvents={Platform.OS === 'android' ? 'box-none' : undefined}
          style={{ height: dimensions.height, width: dimensions.width }}
        >
          <G x={dimensions.width / 2} y={dimensions.height / 2}>
            {/* Renderizar slices do gráfico */}
            {pieSlices.map((slice: any, index: number) => {
              // Encontrar o item correspondente ao slice
              const sliceData = slice.data as IPieDataItem;
              if (!sliceData || !arcs[index]) {
                return null;
              }

              const pathData = arcs[index](slice);
              if (!pathData) {
                return null;
              }

              return (
                <Path key={sliceData.key} {...sliceData.svg} d={pathData} />
              );
            })}
            {/* Conteúdo do centro (children) */}
            {children && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                {children}
              </View>
            )}
          </G>
        </Svg>
      </View>
    </View>
  );
};

const PieChart: React.FC<IPieChartProps> = ({ data, loading }) => {
  // Preparar dados do gráfico com useMemo
  const { pieData, subtitle, hasNoData } = useMemo(() => {
    const deliveredColor = darken(0.1, Colors.ecoop.primary);
    const soldColor = darken(0.1, Colors.ecoop.secondary);

    const delivered: IGraphData = {
      amount: data.delivered,
      key: 'Entregue',
      svg: { fill: deliveredColor },
    };

    const sold: IGraphData = {
      amount: data.delivered === 0 ? data.sold : data.sold - data.delivered,
      key: 'Vendido',
      svg: { fill: soldColor },
    };

    const p: Array<IGraphData> = [delivered, sold];
    const s: Array<IGraphSubtitle> = [
      { color: deliveredColor, label: 'Entregue' },
      { color: soldColor, label: 'Vendido' },
    ];

    return {
      pieData: p,
      subtitle: s,
      hasNoData: data.delivered === 0 && data.sold === 0,
    };
  }, [data.delivered, data.sold, data.measurementUnit]);

  const valueAccessor = useCallback(
    ({ item }: { item: IGraphData }) => item.amount,
    [],
  );

  return (
    <Container>
      <View style={{ paddingLeft: 16, paddingTop: 12 }}>
        <TextBold size={14}>Vendido x Entregue</TextBold>
      </View>
      {loading ? (
        <Loading />
      ) : hasNoData ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 48,
            marginTop: 12,
          }}
        >
          <TextRegular size={14}>0</TextRegular>
          <TextRegular size={13}>0</TextRegular>
        </View>
      ) : (
        <>
          <PieChartSvg
            style={{ height: 200, marginTop: 12 }}
            valueAccessor={valueAccessor}
            data={pieData}
            innerRadius="90%"
            outerRadius="83%"
            padAngle={0}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <TextRegular size={14}>{`${Math.ceil(data.sold)} ${
                data.measurementUnit
              } vendidas`}</TextRegular>
              <TextRegular size={13}>{`${Math.ceil(data.delivered)} ${
                data.measurementUnit
              } entregues`}</TextRegular>
            </View>
          </PieChartSvg>
          <Subtitle>
            <View>
              {subtitle.map(s => (
                <RowSubtitle key={s.label}>
                  <DotSubtitle color={s.color} />
                  <TextRegular size={12}>{s.label}</TextRegular>
                </RowSubtitle>
              ))}
            </View>
          </Subtitle>
        </>
      )}
    </Container>
  );
};

export default PieChart;
