import { Dimensions, PixelRatio, Platform } from 'react-native';

const { height, width } = Dimensions.get('screen');

const Ratio = height / width;

const widthPercentageToDP = (widthPercent: string | number) => {
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);

  let divider = 100;
  if (Platform.OS === 'ios') {
    if (Ratio < 2) {
      divider = 95;
    } else {
      divider = 100;
    }
  } else if (Ratio < 1.5) {
    divider = 90;
  } else if (Ratio >= 1.5 && Ratio < 2) {
    divider = 70;
  } else if (Ratio >= 2 && Ratio < 2.5) {
    divider = 100;
  } else if (Ratio >= 2.5 && Ratio < 3) {
    divider = 100;
  } else if (Ratio >= 3 && Ratio < 4) {
    divider = 95;
  } else if (Ratio >= 4) {
    divider = 100;
  }
  return PixelRatio.roundToNearestPixel((width * elemWidth) / divider);
};

const heightPercentageToDP = (heightPercent: string | number) => {
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  let divider = 100;
  if (Platform.OS === 'ios') {
    if (Ratio < 2) {
      divider = 85;
    } else {
      divider = 100;
    }
  } else if (Ratio < 1.5) {
    divider = 85;
  } else if (Ratio >= 1.5 && Ratio < 2) {
    divider = 68;
  } else if (Ratio >= 2 && Ratio < 2.5) {
    divider = 100;
  } else if (Ratio >= 2.5 && Ratio < 3) {
    divider = 100;
  } else if (Ratio >= 3 && Ratio < 4) {
    divider = 75;
  } else if (Ratio >= 4) {
    divider = 100;
  }

  return PixelRatio.roundToNearestPixel((height * elemHeight) / divider);
};

export { widthPercentageToDP, heightPercentageToDP, Ratio };
