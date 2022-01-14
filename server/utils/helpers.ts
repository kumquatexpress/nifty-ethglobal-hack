import pLimit from "p-limit";

export const promiseConcurrencyLimiter = (concurrency: number): Function => {
  return pLimit(concurrency);
};
export const pl1 = promiseConcurrencyLimiter(1);
export const pl2 = promiseConcurrencyLimiter(2);
export const pl3 = promiseConcurrencyLimiter(3);
export const pl5 = promiseConcurrencyLimiter(5);
export const pl8 = promiseConcurrencyLimiter(8);
export const pl13 = promiseConcurrencyLimiter(13);

export const emailMatchesRegex = (email) => {
  const r = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  return Boolean(email.match(r));
};

export const numberToNthString = (num: number): string => {
  switch (num % 10) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
};
