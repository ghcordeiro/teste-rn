export const isNullOrUndefined = (object: any): boolean => {
  return object === null || object === undefined;
};

export const isNotNullAndUndefined = (object: any): boolean => {
  return object !== null && object !== undefined;
};
