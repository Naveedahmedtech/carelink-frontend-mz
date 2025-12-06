import { format, parseISO, isValid } from "date-fns";

/* ---------- utils ---------- */
export function money(cents?: number) {
  if (cents == null) return "$0.00";
  return `$${(cents / 100).toFixed(2)}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function toDate(v?: string | Date | number | null) {
  if (!v) return null;
  if (v instanceof Date) return isValid(v) ? v : null;
  if (typeof v === "string") {
    const d = parseISO(v);
    return isValid(d) ? d : null;
  }
  if (typeof v === "number") {
    const d = new Date(v);
    return isValid(d) ? d : null;
  }
  return null;
}

export function safeFormat(v: string | Date | number | null | undefined, pattern: string) {
  const d = toDate(v);
  return d ? format(d, pattern) : "-";
}

export function initials(name?: string) {
  if (!name) return "?";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const norm = (s: string) => s?.toLowerCase?.() ?? "";
