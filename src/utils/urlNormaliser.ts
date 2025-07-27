function normalizeUrl(input: string | Record<string, string>): string {
  if (typeof input === "string") return input;
  if (typeof input === "object") {
    const [key, value] = Object.entries(input)[0];
    return `${key}=${value}`;
  }
  return "";
}