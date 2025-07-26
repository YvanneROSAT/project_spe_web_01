import z from "zod";

export function getFromLocalStorage<Schema extends z.ZodType>(
  key: string,
  schema: Schema
): z.infer<Schema> | null {
  const localStr = localStorage.getItem(key);
  if (!localStr) {
    return null;
  }

  try {
    const data = JSON.parse(localStr);

    return schema.parse(data);
  } catch {
    localStorage.remove(key);

    return null;
  }
}
