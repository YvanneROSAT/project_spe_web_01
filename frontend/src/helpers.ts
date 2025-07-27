export const html = String.raw;

export function extractFormData(
  form: HTMLFormElement
): Record<string, FormDataEntryValue> {
  return Object.fromEntries(new FormData(form).entries());
}
