export function format(date: Date) {
  return date.toISOString().split('T')[0];
}

/**
 * Returnes a normalized date range as a 2-tuple of dates in ISO format
 */
export function serializeDateRange(range: Array<string | undefined>) {
  return range.join('|');
}

export function deserializeDateRange(range: string) {
  return range.split('|');
}

/**
 * Returns a date of some weeks ago in ISO format
 */
export function weeksAgo(date: Date, weeks: number) {
  return format(
    new Date(date.getTime() - 1000 * 60 * 60 * 24 * 7 /* days */ * weeks)
  );
}

/**
 * Returns a today's date in ISO format
 */
export function today() {
  return format(new Date());
}

// /**
//  * Returns true if the date ranges are equal, otherwise false
//  */
// export function isDateRangesEqual(
//   range1: Array<string | undefined>,
//   range2: Array<string | undefined>
// ) {
//   const [from1, to1] = normalizeDateRange(range1);
//   const [from2, to2] = normalizeDateRange(range2);

//   if (from1 !== from2 || to1 !== to2) {
//     return false;
//   }

//   return true;
// }
