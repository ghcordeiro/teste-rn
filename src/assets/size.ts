import { Dimensions, PixelRatio, Platform } from 'react-native';

const { height, width, fontScale } = Dimensions.get('window');

const scale = width / 320;

const retornaNewSize = (size: number, text = false) => {
  if (fontScale === 1) {
    if (Platform.OS === 'ios') {
      return size * scale - fontScale * scale;
    }
    return size * scale;
  }
  if (fontScale > 1) {
    if (Platform.OS === 'ios') {
      if (fontScale === 1.118) {
        return text
          ? size * scale - fontScale * 2.0
          : size * scale - fontScale * 2;
      }
      if (fontScale === 1.235) {
        return text
          ? size * scale - fontScale * 3
          : size * scale - fontScale * 2;
      }
      if (fontScale === 1.353) {
        return text
          ? size * scale - fontScale * 3.7
          : size * scale - fontScale * 2;
      }
    }
    return text ? size * scale - fontScale * 2.5 : size * scale - fontScale * 2;
  }
  if (fontScale < 1) {
    if (Platform.OS === 'ios') {
      if (fontScale === 0.823) {
        return text
          ? size * scale - fontScale * 0.4
          : size * scale - fontScale * 2;
      }
    }
  }
  return text
    ? size * scale * (fontScale + fontScale * 0.25)
    : size * scale * fontScale;
};

const normalize = (size: number) => {
  const newSize = retornaNewSize(size, true);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const normalizeHeight = (size: number) => {
  const newSize = retornaNewSize(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const buttonSize = {
  large: {
    height: normalizeHeight(60),
    width: 100,
    font: normalize(20)
  },
  normal: {
    height: normalizeHeight(50),
    width: 100,
    font: normalize(18)
  },
  small: {
    height: normalizeHeight(35),
    width: 48,
    font: normalize(15)
  },
  extraSmall: {
    height: normalizeHeight(25),
    width: 40,
    font: normalize(14)
  }
};

export {
  height,
  width,
  fontScale,
  scale,
  buttonSize,
  normalize,
  normalizeHeight
};
