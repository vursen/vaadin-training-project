/**
 * Parses a date.
 *
 * Supported date format: `dd/mm/yyyy`
 */
export function parseDate(date: string) {
  const [day, month, year] = date.split('/');

  return new Date(`${year}-${month}-${day}`);
}

/**
 * Returns a date in ISO format
 */
export function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

/**
 * Substracts a number of weeks from the today's date,
 * returns the resulting date in ISO format
 */
export function weeksAgo(weeks: number) {
  const date = new Date(
    Date.now() - 1000 * 60 * 60 * 24 * 7 /* days */ * weeks
  );

  return formatDate(date);
}

/**
 * Returns the today's date in ISO format
 */
export function today() {
  return formatDate(new Date());
}
