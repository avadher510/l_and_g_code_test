/** Duration of cart inactivity in milliseconds before the cart expires and stock reservations are released. */
export const CART_INACTIVITY_TIMEOUT_MS = 120_000;

/** How frequently the expiry scheduler polls for inactive carts, in milliseconds. */
export const SCHEDULER_POLLING_INTERVAL_MS = 30_000;

/** Maximum quantity of a single product that can be added to a cart in one operation. */
export const MAXIMUM_CART_ITEM_QUANTITY = 99;

/** Minimum quantity of a single product that can be added to a cart. */
export const MINIMUM_CART_ITEM_QUANTITY = 1;

/** Stock level at or below which a product is classified as low stock. */
export const LOW_STOCK_THRESHOLD_QUANTITY = 5;
