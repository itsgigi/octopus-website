/** Throws when two items share the same key — content errors should fail the build. */
export function assertUnique<T>(items: T[], key: (item: T) => string, label: string) {
  const seen = new Set<string>();
  for (const item of items) {
    const value = key(item);
    if (seen.has(value)) throw new Error(`Duplicate ${label}: "${value}"`);
    seen.add(value);
  }
}
