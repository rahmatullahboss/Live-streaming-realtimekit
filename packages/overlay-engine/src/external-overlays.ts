export function getExternalOverlayUrls(value?: string | null): string[] {
  if (!value) return [];

  return value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => item.startsWith("https://") || item.startsWith("http://"));
}
