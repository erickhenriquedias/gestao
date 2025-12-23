import { CURRENCIES } from '../constants/currencies';

export const formatCurrency = (value, currency = 'BRL') => {
  try {
    const config = CURRENCIES[currency] || CURRENCIES['BRL'];
    const numericValue = typeof value === 'number' ? value : 0;
    return new Intl.NumberFormat(config.locale, { style: 'currency', currency: currency }).format(numericValue);
  } catch (e) {
    return `${currency} 0.00`;
  }
};

export const formatCurrencyUnit = (value, currency = 'BRL') => {
  try {
    const config = CURRENCIES[currency] || CURRENCIES['BRL'];
    const numericValue = typeof value === 'number' ? value : 0;
    const options = { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 };
    if (numericValue < 1 && numericValue > 0) options.maximumFractionDigits = 4;
    return new Intl.NumberFormat(config.locale, options).format(numericValue);
  } catch (e) {
    return `${currency} 0.00`;
  }
};

export const formatPercentage = (value) => {
  if (value === null || value === undefined) return 'OFF';
  return `${value > 0 ? '+' : ''}${Number(value).toFixed(2)}%`;
};

export const renderPriceOrOff = (value) => {
  if (value === null || value === undefined) return 'OFF';
  return formatCurrency(value);
};