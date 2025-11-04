import Colors from '@colors';
import {TextBold} from '@globalStyle';
import formatNumber from '@utils/formatNumber';
import {darken} from 'polished';
import React, {useCallback, useMemo, useState} from 'react';
import {LayoutChangeEvent, View} from 'react-native';
import Svg, {G, Rect, Text as SvgText} from 'react-native-svg';
import {Body} from './styles';

interface TopVendas {
  buyer: string;
  quantity: number;
  measurementUnit: string;
}

interface IBarChartVerticalWithLabelsProps {
  data: Array<TopVendas>;
}

// Constantes do gráfico
const Y_AXIS_WIDTH = 140; // Aumentado para evitar truncamento
const CHART_PADDING = {top: 10, bottom: 10, left: 8, right: 45}; // Reduzido padding para usar mais espaço
const BAR_SPACING = 0.1;
const OUTER_SPACING = 0.5; // Reduzido para usar mais espaço vertical
const MIN_CHART_HEIGHT = 80;
const BAR_HEIGHT_PER_ITEM = 50;
const MIN_DATA_ITEMS = 3;
const LABEL_OFFSET = 45; // Espaçamento dos labels
const HEADER_HEIGHT = 44; // Altura do header (título + padding)

// Funções auxiliares para escalas (substituindo d3-scale)
const createLinearScale = (
  domainMin: number,
  domainMax: number,
  rangeMin: number,
  rangeMax: number,
) => {
  const domainSize = domainMax - domainMin;
  const rangeSize = rangeMax - rangeMin;
  return (value: number) => {
    if (domainSize === 0) {
      return rangeMin;
    }
    return ((value - domainMin) / domainSize) * rangeSize + rangeMin;
  };
};

const createBandScale = (
  domain: string[],
  rangeMin: number,
  rangeMax: number,
  paddingInner: number,
  paddingOuter: number,
) => {
  const rangeSize = rangeMax - rangeMin;
  const domainLength = domain.length;

  if (domainLength === 0) {
    return {scale: () => undefined, bandwidth: () => 0};
  }

  // Cálculo do bandwidth baseado no padding
  const step = rangeSize / (domainLength + paddingOuter * 2 - paddingInner);
  const bandwidth = step * (1 - paddingInner);
  const startOffset = step * paddingOuter;

  return {
    scale: (value: string) => {
      const index = domain.indexOf(value);
      if (index === -1) {
        return undefined;
      }
      return rangeMin + startOffset + index * step;
    },
    bandwidth: () => bandwidth,
  };
};

const BarChartVerticalWithLabels: React.FC<
  IBarChartVerticalWithLabelsProps
> = ({data}) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const [chartWidth, setChartWidth] = useState(0);
  const [yAxisHeight, setYAxisHeight] = useState(0);

  // Memoizar dados ordenados e cálculos
  const {sortedData, maxQuantity, cutOff, reversedData} = useMemo(() => {
    const sorted = [...data].sort((a, b) => b.quantity - a.quantity);
    const max =
      sorted.length > 0 ? Math.max(...sorted.map(d => d.quantity)) : 1;
    const cutoff =
      sorted.length > 0 && sorted[0].quantity ? sorted[0].quantity : 0;
    const reversed = [...sorted].reverse();

    return {
      sortedData: sorted,
      maxQuantity: max,
      cutOff: cutoff,
      reversedData: reversed,
    };
  }, [data]);

  // Calcular altura disponível para o gráfico
  const availableChartHeight = useMemo(() => {
    if (containerHeight === 0) {
      return 0;
    }
    return Math.max(
      containerHeight - HEADER_HEIGHT,
      sortedData.length * BAR_HEIGHT_PER_ITEM,
    );
  }, [containerHeight, sortedData.length]);

  // Escalas calculadas
  const chartAvailableWidth = useMemo(
    () =>
      chartWidth > 0
        ? chartWidth - CHART_PADDING.left - CHART_PADDING.right
        : 300,
    [chartWidth],
  );
  const chartAvailableHeight = useMemo(
    () => availableChartHeight - CHART_PADDING.top - CHART_PADDING.bottom,
    [availableChartHeight],
  );

  const xScale = useMemo(
    () => createLinearScale(0, maxQuantity, 0, chartAvailableWidth),
    [maxQuantity, chartAvailableWidth],
  );

  const yScale = useMemo(() => {
    const domain = sortedData.map((_, index) => index.toString());
    return createBandScale(
      domain,
      CHART_PADDING.top,
      CHART_PADDING.top + chartAvailableHeight,
      BAR_SPACING,
      OUTER_SPACING,
    );
  }, [sortedData, chartAvailableHeight]);

  const barHeight = yScale.bandwidth();
  const barColor = darken(0.1, Colors.ecoop.primary);

  // Handlers
  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setContainerHeight(height);
  }, []);

  const handleChartLayout = useCallback((event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setChartWidth(width);
    setChartHeight(height);
  }, []);

  const handleYAxisLayout = useCallback((event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setYAxisHeight(height);
  }, []);

  // Validação de dados
  const hasEnoughData = sortedData.length >= MIN_DATA_ITEMS;

  return (
    <Body onLayout={handleContainerLayout}>
      <View style={{paddingLeft: 16, paddingTop: 12}}>
        <TextBold size={14}>Top 6 Clientes</TextBold>
      </View>
      {!hasEnoughData ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
            minHeight: 100,
          }}>
          <TextBold size={14}>
            Não há dados suficiente para exibir o gráfico
          </TextBold>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginTop: -8,
            minHeight: availableChartHeight || 300,
          }}>
          {/* Y-Axis com labels dos compradores */}
          <View
            style={{width: Y_AXIS_WIDTH, height: availableChartHeight}}
            onLayout={handleYAxisLayout}>
            {yAxisHeight > 0 && availableChartHeight > 0 && (
              <Svg width={Y_AXIS_WIDTH} height={availableChartHeight}>
                <G>
                  {reversedData.map((item, index) => {
                    const yPos = yScale.scale(
                      (sortedData.length - 1 - index).toString(),
                    );
                    if (yPos === undefined) {
                      return null;
                    }
                    return (
                      <SvgText
                        key={`y-label-${index}`}
                        x={Y_AXIS_WIDTH - 8}
                        y={yPos + barHeight / 2}
                        fontSize={12}
                        fill="#585858"
                        textAnchor="end"
                        alignmentBaseline="middle">
                        {item.buyer}
                      </SvgText>
                    );
                  })}
                </G>
              </Svg>
            )}
          </View>

          {/* Gráfico de barras */}
          <View
            style={{flex: 2, height: availableChartHeight}}
            onLayout={handleChartLayout}>
            {availableChartHeight > 0 && chartWidth > 0 && (
              <Svg width={chartWidth} height={availableChartHeight}>
                <G>
                  {sortedData.map((item, index) => {
                    const barWidth = xScale(item.quantity);
                    const yPos = yScale.scale(index.toString());

                    if (yPos === undefined) {
                      return null;
                    }

                    // Determinar se label fica dentro ou fora da barra
                    // Label dentro se a barra for grande o suficiente
                    const isLabelInside = barWidth > LABEL_OFFSET * 2;
                    const labelX = isLabelInside
                      ? barWidth - LABEL_OFFSET
                      : barWidth + LABEL_OFFSET;
                    const labelFill = isLabelInside
                      ? Colors.ecoop.white
                      : Colors.ecoop.darkGray;
                    const labelFontWeight = isLabelInside ? 'bold' : 'normal';

                    return (
                      <G key={`bar-${index}`}>
                        {/* Barra */}
                        <Rect
                          x={CHART_PADDING.left}
                          y={yPos}
                          width={barWidth}
                          height={barHeight}
                          fill={barColor}
                        />
                        {/* Label com valor */}
                        <SvgText
                          x={CHART_PADDING.left + labelX}
                          y={yPos + barHeight / 2}
                          fontSize={13}
                          fontWeight={labelFontWeight}
                          fill={labelFill}
                          textAnchor="middle"
                          alignmentBaseline="middle">
                          {`${formatNumber(item.quantity, false)} ${
                            item.measurementUnit
                          }`}
                        </SvgText>
                      </G>
                    );
                  })}
                </G>
              </Svg>
            )}
          </View>
        </View>
      )}
    </Body>
  );
};

export default BarChartVerticalWithLabels;
