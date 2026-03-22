/**
 * Formats a value in pence as a British pound sterling currency string.
 * Uses the British English locale and proper currency symbol placement.
 *
 * @param pence - The amount in pence (e.g., 1299 for £12.99)
 * @returns Formatted currency string (e.g., "£12.99")
 */
export function formatCurrency(pence: number): string {
  const pounds = pence / 100;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(pounds);
}
