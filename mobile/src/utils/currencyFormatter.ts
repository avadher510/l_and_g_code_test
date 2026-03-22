/**
 * Converts an integer pence value to a formatted pound sterling string.
 * Uses integer arithmetic to avoid floating-point precision issues;
 * always returns exactly two decimal places.
 *
 * @param pence - The monetary amount as an integer number of pence
 * @returns A formatted string such as '£279.99'
 */
export function formatPenceAsPoundsSterling(pence: number): string {
  const pounds = Math.floor(pence / 100);
  const remainingPence = pence % 100;
  return `£${pounds}.${remainingPence.toString().padStart(2, '0')}`;
}
