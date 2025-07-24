export function removeUndefinedFromObject(obj: object) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => v !== undefined)
  );
}
