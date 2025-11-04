export default (string: string): string =>
  string
    ? string.toLowerCase().replace(/(?:^|\s)\S/g, (a) => {
        return a.toUpperCase();
      })
    : string;
