export const toETH = (_gas) => {
  return _gas / Math.pow(10, 9) / Math.pow(10, 9);
};

export const toBTC = (_gas) => {
  return _gas / Math.pow(10, 8);
};
