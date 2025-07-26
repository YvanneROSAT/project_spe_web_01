export async function getHIBPMatches(prefix: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();

    return res.ok ? text.split("\n") : [];
  } catch {
    return [];
  }
}
