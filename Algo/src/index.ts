import { fizzbuzz } from './fizzbuzz.js';

const getDefaultMaximum = (): string => '100';

const getMaximum = (): string => {
  const maximumIndex: number = process.argv.findIndex((arg) => arg === '--max');
  return maximumIndex >= 0 && maximumIndex + 1 < process.argv.length
    ? process.argv[maximumIndex + 1]
    : getDefaultMaximum();
};

fizzbuzz(1, Number(getMaximum())).forEach((value, index: number, fizzbuzzes: string[]) => {
  process.stdout.write(`${value}${index === fizzbuzzes.length - 1 ? '\n' : ', '}`);
});
