import type { CurrencyCode } from '../types';

export const CURRENCY_CODE: CurrencyCode = 'BDT';
export const CURRENCY_SYMBOL = '৳';

export const FREE_SHIPPING_THRESHOLD_BDT = 650;
export const STANDARD_SHIPPING_BDT = 35;

export function formatPrice(amountBdt: number, _currency: CurrencyCode = 'BDT'): string {
  const rounded = Math.round(amountBdt);
  return `${CURRENCY_SYMBOL}${rounded.toLocaleString('en-US')}`;
}
