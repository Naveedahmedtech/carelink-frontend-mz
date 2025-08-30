import * as React from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import UnfoldMoreDoubleRoundedIcon from "@mui/icons-material/UnfoldMoreDoubleRounded";
import UnfoldLessDoubleRoundedIcon from "@mui/icons-material/UnfoldLessDoubleRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { AGREEMENT_SECTIONS } from "../shared/agreementText";

type Props = { onScrolledToEnd: (done: boolean) => void };

const FONT_KEY = "agreement:fontScale";

/** Small debounce hook */
function useDebounced<T>(value: T, delay = 200) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function AgreementReader({ onScrolledToEnd }: Props) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  const [fontScale, setFontScale] = React.useState<number>(() => {
    const saved = Number(localStorage.getItem(FONT_KEY));
    return saved && saved >= 0.8 && saved <= 1.6 ? saved : 1;
  });
  React.useEffect(() => {
    localStorage.setItem(FONT_KEY, String(fontScale));
  }, [fontScale]);

  const [query, setQuery] = React.useState("");
  const q = useDebounced(query.trim());
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
  const [readPct, setReadPct] = React.useState(0);

  // Search navigation
  const [matchCount, setMatchCount] = React.useState(0);
  const [activeMatch, setActiveMatch] = React.useState(0); // 0-based
  const lastQueryRef = React.useRef("");

  /** Expand/collapse helpers */
  const toggleAll = (open: boolean) => {
    const next: Record<number, boolean> = {};
    AGREEMENT_SECTIONS.forEach((_, i) => (next[i] = open));
    setExpanded(next);
  };
  const toggleOne = (i: number) =>
    setExpanded((s) => ({ ...s, [i]: !Boolean(s[i]) }));

  /** Scroll progress + end detection */
  React.useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const update = () => {
      const max = Math.max(1, root.scrollHeight - root.clientHeight);
      const pct = Math.min(100, Math.round(((root.scrollTop || 0) / max) * 100));
      setReadPct(pct);
    };

    update(); // initial
    const onScroll = () => requestAnimationFrame(update);
    root.addEventListener("scroll", onScroll, { passive: true });

    // If content fits, consider fully read
    if (root.scrollHeight <= root.clientHeight + 1) {
      setReadPct(100);
      onScrolledToEnd(true);
    }

    const io = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onScrolledToEnd(true),
      { root, threshold: 0.8 }
    );
    if (endRef.current) io.observe(endRef.current);

    return () => {
      root.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [onScrolledToEnd]);

  /** Build highlighted nodes (robust, allocation-friendly) */
  const highlightedSections = React.useMemo(() => {
    let counter = 0;
    const safe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = q ? new RegExp(`(${safe(q)})`, "ig") : null;

    const sections = AGREEMENT_SECTIONS.map((sec, secIndex) => {
      if (!re) return { ...sec, nodes: [sec.body], hits: 0 };

      const parts = sec.body.split(re);
      const nodes: React.ReactNode[] = [];
      let hits = 0;

      for (let i = 0; i < parts.length; i++) {
        const chunk = parts[i];
        const isHit = i % 2 === 1; // capturing group slices hits into odd indices
        if (isHit) {
          const idx = counter++;
          hits++;
          nodes.push(
            <mark
              key={`m-${secIndex}-${idx}`}
              data-match-idx={idx}
              className="rounded px-0.5 bg-[color:var(--color-background-shade-2)]"
            >
              {chunk}
            </mark>
          );
        } else {
          nodes.push(<React.Fragment key={`t-${secIndex}-${i}`}>{chunk}</React.Fragment>);
        }
      }

      return { ...sec, nodes, hits };
    });

    return { sections, total: counter };
  }, [q]);

  // Update match count + auto-expand sections with hits
  React.useEffect(() => {
    setMatchCount(highlightedSections.total);

    if (q !== lastQueryRef.current) {
      setActiveMatch(0);
      lastQueryRef.current = q;

      if (q) {
        const next: Record<number, boolean> = {};
        highlightedSections.sections.forEach((s, i) => (next[i] = (s as any).hits > 0));
        setExpanded(next);
      }
    }
  }, [q, highlightedSections.total, highlightedSections.sections]);

  /** Scroll to current match inside scroll container */
  const goToMatch = React.useCallback(
    (idx: number) => {
      const root = scrollRef.current;
      if (!root) return;
      const el = root.querySelector<HTMLElement>(`mark[data-match-idx="${idx}"]`);
      if (!el) return;

      // Compute delta using rects (robust within scrollable container)
      const er = el.getBoundingClientRect();
      const rr = root.getBoundingClientRect();
      const delta = er.top - rr.top - 24; // adjust ~24px padding
      root.scrollTo({ top: root.scrollTop + delta, behavior: "smooth" });

      // brief brand ring feedback
      el.style.boxShadow = "0 0 0 2px var(--color-primary)";
      setTimeout(() => (el.style.boxShadow = ""), 900);
    },
    []
  );

  const nextMatch = () => {
    if (!matchCount) return;
    const idx = (activeMatch + 1) % matchCount;
    setActiveMatch(idx);
    goToMatch(idx);
  };
  const prevMatch = () => {
    if (!matchCount) return;
    const idx = (activeMatch - 1 + matchCount) % matchCount;
    setActiveMatch(idx);
    goToMatch(idx);
  };

  /** Keyboard shortcuts: Enter/Shift+Enter to navigate, Esc to clear */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (!q || !matchCount) return;

      if (e.key === "Enter" && inInput) {
        e.preventDefault();
        if (e.shiftKey) prevMatch();
        else nextMatch();
      } else if (e.key === "Escape" && inInput && query) {
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [q, matchCount, nextMatch, prevMatch, query]);

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-backgroundShade1 text-text">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 bg-backgroundShade1/95 backdrop-blur border-b border-border">
        <div className="p-4 sm:p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <SearchRoundedIcon className="absolute left-2 top-2.5 text-textSecondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search in agreement…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search in agreement"
              className="w-full pl-8 pr-24 py-2 text-sm rounded-lg border border-border bg-backgroundShade1 text-text focus:ring-2 focus:ring-[color:var(--color-primary)] outline-none"
            />
            {/* Match controls */}
            <div className="absolute right-1 top-1 flex items-center gap-1">
              <span className="px-2 py-1 text-xs rounded bg-background text-textSecondary border border-border">
                {matchCount ? `${activeMatch + 1}/${matchCount}` : "0"}
              </span>
              <button
                type="button"
                aria-label="Previous match"
                onClick={prevMatch}
                disabled={!matchCount}
                className="p-1 rounded hover:bg-backgroundShade2 disabled:opacity-40"
                title="Previous (Shift+Enter)"
              >
                <KeyboardArrowUpRoundedIcon fontSize="small" />
              </button>
              <button
                type="button"
                aria-label="Next match"
                onClick={nextMatch}
                disabled={!matchCount}
                className="p-1 rounded hover:bg-backgroundShade2 disabled:opacity-40"
                title="Next (Enter)"
              >
                <KeyboardArrowDownRoundedIcon fontSize="small" />
              </button>
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                disabled={!query}
                className="p-1 rounded hover:bg-backgroundShade2 disabled:opacity-40"
                title="Clear"
              >
                <ClearRoundedIcon fontSize="small" />
              </button>
            </div>
          </div>

          {/* Font size + expand/collapse + progress */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 min-w-[220px]">
              <span className="text-xs text-textSecondary whitespace-nowrap">Text size</span>
              <input
                type="range"
                min={0.9}
                max={1.3}
                step={0.05}
                value={fontScale}
                onChange={(e) => setFontScale(parseFloat(e.target.value))}
                className="flex-1 accent-[color:var(--color-primary)]"
                aria-label="Adjust text size"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleAll(true)}
                type="button"
                className="px-2 py-1 rounded hover:bg-backgroundShade2"
                title="Expand all"
                aria-label="Expand all"
              >
                <UnfoldMoreDoubleRoundedIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => toggleAll(false)}
                type="button"
                className="px-2 py-1 rounded hover:bg-backgroundShade2"
                title="Collapse all"
                aria-label="Collapse all"
              >
                <UnfoldLessDoubleRoundedIcon className="w-5 h-5" />
              </button>
            </div>

            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold border border-border bg-background"
              title="Read progress"
            >
              {readPct}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-border relative">
          <div
            className="h-1 transition-all"
            style={{
              width: `${readPct}%`,
              background: "var(--color-primary)",
            }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-extrabold mb-1">CareLink Service Agreement</h2>
        <p className="text-sm text-textSecondary mb-3">
          Please read the agreement. Scroll to the end, tick the acknowledgements, and sign to continue.
        </p>

        <div className="border border-border rounded-lg overflow-hidden">
          <div
            ref={scrollRef}
            className="max-h-[calc(100vh-320px)] md:max-h-[calc(100vh-300px)] overflow-auto p-4 sm:p-6 space-y-6 bg-background"
            style={{ fontSize: `${fontScale}rem` }}
            role="region"
            aria-label="Agreement text"
          >
            {highlightedSections.sections.map((sec, i) => (
              <section key={sec.title} aria-labelledby={`h-${i}`} className="space-y-2">
                <button
                  type="button"
                  onClick={() => toggleOne(i)}
                  aria-expanded={Boolean(expanded[i])}
                  className="w-full text-left flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-backgroundShade2"
                >
                  <ExpandMoreRoundedIcon
                    className={`w-5 h-5 transform transition-transform ${
                      expanded[i] ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                  <span id={`h-${i}`} className="font-bold">
                    {i + 1}. {sec.title}
                  </span>
                  {q && (sec as any).hits ? (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded bg-backgroundShade2 text-textSecondary border border-border">
                      {(sec as any).hits}
                    </span>
                  ) : null}
                </button>

                {expanded[i] !== false && (
                  <p className="leading-relaxed whitespace-pre-line">{(sec as any).nodes}</p>
                )}

                {i < AGREEMENT_SECTIONS.length - 1 && (
                  <hr className="border-border my-3" />
                )}
              </section>
            ))}

            <div ref={endRef} className="h-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
