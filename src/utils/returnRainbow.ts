import Colors from '@colors';

export default (width: number) => {
  if (width < 11.11) {
    return Colors.rainbow.r0;
  }
  if (width >= 11.11 && width < 22.22) {
    return Colors.rainbow.r1;
  }
  if (width >= 22.22 && width < 33.33) {
    return Colors.rainbow.r2;
  }
  if (width >= 33.33 && width < 44.44) {
    return Colors.rainbow.r3;
  }
  if (width >= 44.44 && width < 55.55) {
    return Colors.rainbow.r4;
  }
  if (width >= 55.55 && width < 66.66) {
    return Colors.rainbow.r5;
  }
  if (width >= 66.66 && width < 77.77) {
    return Colors.rainbow.r6;
  }
  if (width >= 77.77 && width < 88.88) {
    return Colors.rainbow.r7;
  }
  return Colors.rainbow.r8;
};
