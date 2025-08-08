/**
 * Calculates the number of days between two date strings.
 *
 * @param start - The start date as a string (parsable by `Date`).
 * @param end - The end date as a string (parsable by `Date`).
 * @returns The number of days between the start and end dates.
 *
 * @remarks
 * The result may be a fractional number if the time components of the dates differ.
 * Assumes both date strings are in a format recognized by the JavaScript `Date` constructor.
 */
export function daysBetween(start: string, end: string) {
  return (
    (new Date(end).getTime() - new Date(start).getTime()) /
    (1000 * 60 * 60 * 24)
  );
}

export function getDateParts(date: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}
