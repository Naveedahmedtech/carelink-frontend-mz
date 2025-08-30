/**
 * Build a Google Calendar "Create Event" URL that opens in a new tab.
 * This requires no API or OAuth — user just clicks "Save" in Calendar.
 */
export function googleCalendarCreateUrl(params: {
  title: string;
  start: Date;              // JS Date for event start (local or UTC)
  durationMin: number;
  details?: string;
  location?: string;
  tz?: string;              // optional IANA tz (e.g. "Asia/Karachi")
  guests?: string[];        // optional list of emails
}) {
  const end = new Date(params.start.getTime() + params.durationMin * 60_000);

  // Convert to Google Calendar’s compact UTC format (YYYYMMDDTHHmmssZ)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");

  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: params.title,
    dates: `${fmt(params.start)}/${fmt(end)}`,
    details: params.details || "",
    location: "https://meet.google.com/pjv-tghe-tsk",
  });

  if (params.tz) q.set("ctz", params.tz);
  if (params.guests?.length) q.append("add", params.guests.join(","));

  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
