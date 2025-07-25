export function removeUndefinedFromObject(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter((field) => field[1] !== undefined)
  );
}
