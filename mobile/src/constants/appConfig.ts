/** Base URL of the BFF; overridable via the EXPO_PUBLIC_BFF_BASE_URL environment variable. */
export const BFF_BASE_URL =
  process.env.EXPO_PUBLIC_BFF_BASE_URL ?? 'http://192.168.0.156:3001';

/** React Query stale time for product catalogue data in milliseconds. */
export const PRODUCT_CATALOGUE_STALE_TIME_MS = 30_000;

/** React Query stale time for cart data in milliseconds; kept low for freshness. */
export const CART_DATA_STALE_TIME_MS = 0;
