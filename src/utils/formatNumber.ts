export default (number: number, percent: boolean) => {
  const valor = percent ? number.toFixed(2) : number.toFixed(0);
  return valor.replace('.', ',').replace(',00', '');
};
