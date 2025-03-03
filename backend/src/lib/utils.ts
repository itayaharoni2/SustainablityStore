export function absoluteServerUrl(path: string): string {
  const baseUrl = process.env.SERVER_URL;
  return new URL(path, baseUrl).toString();
}
