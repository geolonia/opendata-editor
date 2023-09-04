export const dedupe = <T>(arr: T[]): T[] =>
  arr.filter((item, i) => arr.indexOf(item) === i);
