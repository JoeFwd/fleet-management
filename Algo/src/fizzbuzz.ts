const isDividable = (dividend: number, divider: number): boolean => !!dividend && !!divider && dividend % divider === 0;

const fizzbuzzRules = (number: number): string[] => [
  (isDividable(number, 3) && 'Fizz') || '',
  (isDividable(number, 5) && 'Buzz') || ''
];

const resolveFizzbuzzRules = (number: number): string => fizzbuzzRules(number).join('') || `${number}`;

/**
 * Maps a range of numbers to their fizzbuzz values
 * - A number is mapped to Fizz if it is dividable by 3
 * - A number is mapped to Buzz if it is dividable by 5
 * - A number is mapped to FizzBuzz if it is dividable by 3 and 5
 * - Otherwise the number is unchanged
 * @example
 * fizzbuzz(9, 15) // ["Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"]
 * @param start the number to start from
 * @param end the number to end at
 * @returns an array of fizzbuzz values
 */
export const fizzbuzz = (start: number, end: number): string[] =>
  start && end && start > 0 && end > 0 && start <= end
    ? Array.from({ length: end }, (_, index) => resolveFizzbuzzRules(start + index))
    : [];
