/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Svg, {
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
  Use
} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */
interface StyleProps {
  style: {
    height: number;
    width: number;
  };
  styleContainer?: {
    marginTop?: number;
  };
}

const Logo = ({ style, styleContainer, ...rest }: StyleProps) => {
  return (
    <Svg
      width={style?.width}
      height={style?.height}
      style={{ marginTop: styleContainer?.marginTop || 0 }}
      {...rest}
      id="prefix__Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x={0}
      y={0}
      viewBox="0 0 135.18 131.72"
      xmlSpace="preserve">
      <LinearGradient
        id="prefix__SVGID_1_"
        gradientUnits="userSpaceOnUse"
        x1={11.899}
        y1={69.109}
        x2={104.92}
        y2={63.505}>
        <Stop offset={0.008} stopColor="#18c954" />
        <Stop offset={0.103} stopColor="#3cca5c" />
        <Stop offset={0.278} stopColor="#79ca69" />
        <Stop offset={0.439} stopColor="#aacb73" />
        <Stop offset={0.579} stopColor="#cdcc7b" />
        <Stop offset={0.694} stopColor="#e2cc7f" />
        <Stop offset={0.769} stopColor="#eacc81" />
      </LinearGradient>
      <Path
        d="M65.86 28.28c-19.66 0-35.66 16-35.66 35.66v3.83c0 19.66 16 35.66 35.66 35.66 10.42 0 19.8-4.51 26.32-11.66L83 83.71c-4.28 4.6-10.38 7.49-17.14 7.49-12.92 0-23.42-10.51-23.42-23.43v-3.83c0-12.92 10.51-23.43 23.42-23.43 12.92 0 23.43 10.51 23.43 23.43v4.71h12.23v-4.71c0-19.66-16-35.66-35.66-35.66z"
        fill="url(#prefix__SVGID_1_)"
      />
      <Path
        d="M73.61 52.98H62.66c0 8.66 7.02 15.68 15.68 15.68h10.95c-.01-8.66-7.03-15.68-15.68-15.68z"
        fill="#eacc81"
      />
      <Path
        d="M65.86 120.71c-30.24 0-54.85-24.6-54.85-54.85s24.6-54.85 54.85-54.85c30.24 0 54.85 24.6 54.85 54.85 0 .94-.02 1.87-.07 2.8h11.01c.04-.93.07-1.86.07-2.8C131.72 29.54 102.17 0 65.86 0 29.54 0 0 29.54 0 65.86c0 36.31 29.54 65.86 65.86 65.86 18.93 0 36.01-8.04 48.04-20.88l-8.27-7.27c-10.01 10.54-24.13 17.14-39.77 17.14z"
        fill="#18c954"
      />
      <G>
        <Defs>
          <Path
            id="prefix__SVGID_12_"
            d="M65.86 28.28c-19.66 0-35.66 16-35.66 35.66v3.83c0 19.66 16 35.66 35.66 35.66 10.42 0 19.8-4.51 26.32-11.66L83 83.71c-4.28 4.6-10.38 7.49-17.14 7.49-12.92 0-23.42-10.51-23.42-23.43v-3.83c0-12.92 10.51-23.43 23.42-23.43 12.92 0 23.43 10.51 23.43 23.43v4.71h12.23v-4.71c0-19.66-16-35.66-35.66-35.66z"
          />
        </Defs>
        <ClipPath id="prefix__SVGID_3_">
          <Use xlinkHref="#prefix__SVGID_12_" overflow="visible" />
        </ClipPath>
        <LinearGradient
          id="prefix__SVGID_4_"
          gradientUnits="userSpaceOnUse"
          x1={63.245}
          y1={107.452}
          x2={63.245}
          y2={68.656}>
          <Stop offset={0.087} stopColor="#18c954" />
          <Stop offset={0.92} stopColor="#18c954" stopOpacity={0} />
        </LinearGradient>
        <Path
          clipPath="url(#prefix__SVGID_3_)"
          fill="url(#prefix__SVGID_4_)"
          d="M21.8 68.66h82.88v38.8H21.8z"
        />
        <LinearGradient
          id="prefix__SVGID_5_"
          gradientUnits="userSpaceOnUse"
          x1={70.856}
          y1={109.048}
          x2={70.856}
          y2={82.411}>
          <Stop offset={0.085} stopColor="#18c954" />
          <Stop offset={0.92} stopColor="#18c954" stopOpacity={0} />
        </LinearGradient>
        <Path
          clipPath="url(#prefix__SVGID_3_)"
          fill="url(#prefix__SVGID_5_)"
          d="M29.41 82.41h82.88v26.64H29.41z"
        />
        <Path
          clipPath="url(#prefix__SVGID_3_)"
          fill="#18c954"
          d="M67.85 80.78h67.33v32.96H67.85z"
        />
      </G>
    </Svg>
  );
};

export default Logo;
