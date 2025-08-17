// components/AgreementReader.tsx
import * as React from 'react';
import {
  Box, Paper, Typography, Divider, Stack, TextField, IconButton,
  Slider, LinearProgress, alpha, useTheme
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import UnfoldMoreDoubleRoundedIcon from '@mui/icons-material/UnfoldMoreDoubleRounded';
import UnfoldLessDoubleRoundedIcon from '@mui/icons-material/UnfoldLessDoubleRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AGREEMENT_SECTIONS } from '../shared/agreementText';

export default function AgreementReader({
  onScrolledToEnd,
}: { onScrolledToEnd: (done: boolean) => void }) {
  const theme = useTheme();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const endRef = React.useRef<HTMLDivElement | null>(null);

  const [fontScale, setFontScale] = React.useState(1);
  const [query, setQuery] = React.useState('');
  const [expanded, setExpanded] = React.useState<Record<number, boolean>>({});
  const [readPct, setReadPct] = React.useState(0);

  const safeReg = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const renderHighlighted = (text: string) => {
    if (!query.trim()) return text;
    const re = new RegExp(`(${safeReg(query)})`, 'ig');
    return text.split(re).map((chunk, i) =>
      re.test(chunk) ? <mark key={i}>{chunk}</mark> : <React.Fragment key={i}>{chunk}</React.Fragment>
    );
  };
  const toggleAll = (open: boolean) => {
    const next: Record<number, boolean> = {};
    AGREEMENT_SECTIONS.forEach((_, i) => (next[i] = open));
    setExpanded(next);
  };

  React.useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    if (root.scrollHeight <= root.clientHeight + 2) {
      setReadPct(100);
      onScrolledToEnd(true);
    }

    const onScroll = () => {
      const pct = Math.min(100, Math.round(((root.scrollTop + root.clientHeight) / root.scrollHeight) * 100));
      setReadPct(pct);
    };
    root.addEventListener('scroll', onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onScrolledToEnd(true),
      { root, threshold: 0.75 }
    );
    if (endRef.current) io.observe(endRef.current);

    return () => {
      root.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, [onScrolledToEnd]);

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', borderColor: 'divider' }}>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        {/* controls */}
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }}
               justifyContent="space-between" gap={1.25} sx={{ mb: 1.5 }}>
          <TextField
            size="small" fullWidth placeholder="Search in agreement…"
            value={query} onChange={(e) => setQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchRoundedIcon fontSize="small" /> }}
            sx={{ '& .MuiInputBase-input': { pl: 1 } }}
          />
          <Stack direction="row" alignItems="center" gap={1} sx={{ minWidth: { sm: 260 } }}>
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
              Text size
            </Typography>
            <Slider size="small" value={fontScale} min={0.9} max={1.3} step={0.05}
                    onChange={(_, v) => setFontScale(v as number)} sx={{ flex: 1 }} />
            <IconButton aria-label="expand all" onClick={() => toggleAll(true)}>
              <UnfoldMoreDoubleRoundedIcon />
            </IconButton>
            <IconButton aria-label="collapse all" onClick={() => toggleAll(false)}>
              <UnfoldLessDoubleRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5 }}>
          CareLink Service Agreement
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please read the agreement. Scroll to the end, tick the acknowledgements, and sign to continue.
        </Typography>

        <Paper variant="outlined" sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
          <LinearProgress variant="determinate" value={readPct} sx={{ height: 3, borderRadius: 0 }} />

          <Box
            ref={scrollRef}
            sx={{
              '--cl-fs': fontScale,
              maxHeight: { xs: 'calc(100vh - 320px)', md: 'calc(100vh - 300px)' },
              overflow: 'auto',
              p: { xs: 1.5, sm: 2.5 },
              scrollBehavior: 'smooth',
              '& > *': { maxWidth: 'clamp(54ch, 66ch, 72ch)', mx: 'auto' },
              '& .reader-h': { fontSize: 'calc(1.06rem * var(--cl-fs))', fontWeight: 800 },
              '& .reader-p': { fontSize: 'calc(.975rem * var(--cl-fs))', lineHeight: 1.7 },
              '& mark': {
                background: (t) => alpha(t.palette.primary.main, 0.15),
                padding: '0 .15em',
                borderRadius: 2,
              },
            }}
          >
            {AGREEMENT_SECTIONS.map((sec, i) => (
              <Box key={sec.title} id={`sec-${i}`} sx={{ mb: 2.5 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  onClick={() => setExpanded((s) => ({ ...s, [i]: s[i] === false ? true : false }))}
                  sx={{
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: (t) => alpha(t.palette.primary.main, 0.06) },
                  }}
                >
                  <ExpandMoreRoundedIcon
                    sx={{
                      transform: expanded[i] === false ? 'rotate(-90deg)' : 'none',
                      transition: 'transform .2s',
                    }}
                  />
                  <Typography className="reader-h">
                    {i + 1}. {sec.title}
                  </Typography>
                </Stack>

                {/* NEW: quick helper text */}
                {!!sec.hints?.length && (
                  <Box
                    sx={{
                      mt: 0.5, mb: 1,
                      p: 1,
                      borderRadius: 1.5,
                      bgcolor: alpha(theme.palette.info.main, 0.06),
                      border: '1px solid',
                      borderColor: alpha(theme.palette.info.main, 0.25),
                      '& ul': { pl: 2.5, m: 0 },
                      '& li, & .hint': { fontSize: 'calc(.9rem * var(--cl-fs))' },
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <InfoOutlinedIcon fontSize="small" sx={{ mt: 0.25 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography className="hint" sx={{ fontWeight: 600, mb: 0.25 }}>
                          Key points
                        </Typography>
                        <ul>
                          {sec.hints.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      </Box>
                    </Stack>
                  </Box>
                )}

                {expanded[i] === false ? null : (
                  <Box sx={{ pt: 0.5 }}>
                    <Typography className="reader-p" sx={{ whiteSpace: 'pre-line' }}>
                      {renderHighlighted(sec.body)}
                    </Typography>
                  </Box>
                )}

                {i < AGREEMENT_SECTIONS.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}

            <Box ref={endRef} sx={{ height: 1 }} />
          </Box>
        </Paper>
      </Box>
    </Paper>
  );
}
