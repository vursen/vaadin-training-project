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
