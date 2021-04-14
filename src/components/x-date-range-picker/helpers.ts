/**
 * Returns the date in ISO format
 */
export function format(date: Date) {
  return date.toISOString().split('T')[0];
}

/**
 * Serializes the date range into a string
 */
export function serializeDateRange(range: string[], delimiter: string) {
  return range.filter(Boolean).join(delimiter);
}

/**
 * Deserializes the date range from a string
 */
export function deserializeDateRange(range: string, delimiter: string) {
  const [from = '', to = ''] = range.split(delimiter);

  return [from, to];
}

/**
 * Substracts a number of weeks from the today's date,
 * returns the resulting date in ISO format
 */
export function weeksAgo(weeks: number) {
  const date = new Date(
    Date.now() - 1000 * 60 * 60 * 24 * 7 /* days */ * weeks
  );

  return format(date);
}

/**
 * Returns the today's date in ISO format
 */
export function today() {
  return format(new Date());
}
