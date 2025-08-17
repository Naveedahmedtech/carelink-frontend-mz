// utils/companyUrlRegex.ts
// Pure regex + string ops. No libs.

const SCHEME_RE = /^([a-z][a-z0-9+.-]*):\/\//i; // <- numeric group now
const HOST_RE =
  /^(?=.{1,253}$)(?!-)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i;
const IPV4_RE = /^(?:\d{1,3}\.){3}\d{1,3}$/;
const DISALLOWED_TLDS = new Set([
  "local","localhost","localdomain","internal","intranet","home","lan","test","example","invalid",
]);

export function sanitizeAndValidateCompanyUrlRegex(raw: string) {
  const s = (raw || "").trim();
  if (!s) return { ok: false as const, error: "Company URL is required." };

  // If a scheme is present, only allow http/https.
  const schemeMatch = s.match(SCHEME_RE);
  const scheme = schemeMatch ? schemeMatch[1].toLowerCase() : null;
  if (scheme && scheme !== "http" && scheme !== "https") {
    return { ok: false as const, error: "Only http(s) URLs are allowed." };
  }

  // Add https:// if missing, then extract host.
  const withScheme = scheme ? s : `https://${s}`;
  const m = withScheme.match(/^(?:https?:\/\/)?([^/?#:]+)/i);
  if (!m) return { ok: false as const, error: "Enter a valid company URL (e.g., example.com)." };

  const host = m[1].toLowerCase();

  if (IPV4_RE.test(host)) {
    return { ok: false as const, error: "Use your company domain (not an IP address)." };
  }
  if (!HOST_RE.test(host)) {
    return { ok: false as const, error: "Enter a public domain like example.com." };
  }

  const tld = host.split(".").pop()!;
  if (DISALLOWED_TLDS.has(tld)) {
    return { ok: false as const, error: "Use a public company domain (not a private suffix like .local)." };
  }

  // Normalized https URL (hostname only)
  return { ok: true as const, url: `https://${host}`, host };
}
