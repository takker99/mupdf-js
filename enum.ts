export const ENUM = <T>(value: T, list: readonly T[]): number => {
  if (typeof value === "number") {
    if (value >= 0 && value < list.length) {
      return value;
    }
  }
  if (typeof value === "string") {
    const idx = list.indexOf(value);
    if (idx >= 0) {
      return idx;
    }
  }
  throw new TypeError(
    `invalid enum value ("${value}"; expected ${list.join(", ")})`,
  );
};
