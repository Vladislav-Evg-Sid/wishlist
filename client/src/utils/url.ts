const URL_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:\/\//i;

export function normalizeHttpUrl(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  return URL_SCHEME_PATTERN.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;
}

export function isValidHttpUrl(value: string) {
  if (!value.trim()) return true;

  try {
    const url = new URL(normalizeHttpUrl(value));
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

export function getDisplayHostname(value: string) {
  const normalizedUrl = normalizeHttpUrl(value);
  if (!normalizedUrl) return "";

  try {
    const parsedUrl = new URL(normalizedUrl);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return "";
    }

    const authority = normalizedUrl
      .replace(URL_SCHEME_PATTERN, "")
      .split(/[/?#]/, 1)[0];
    const hostWithPort = authority.slice(authority.lastIndexOf("@") + 1);
    const host = hostWithPort.startsWith("[")
      ? hostWithPort.slice(0, hostWithPort.indexOf("]") + 1)
      : hostWithPort.replace(/:\d+$/, "");

    return host.replace(/^www\./i, "");
  } catch {
    return "";
  }
}
