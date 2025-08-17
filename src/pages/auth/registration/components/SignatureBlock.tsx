import * as React from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

export type SignatureValue = { dataUrl: string | null; date: string };

export default function SignatureBlock({
  value,
  onChange,
}: {
  value: SignatureValue;
  onChange: (v: SignatureValue) => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const drawing = React.useRef(false);

  const getCtx = () => canvasRef.current?.getContext('2d') || null;

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    drawing.current = true;
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = pointFromEvent(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = pointFromEvent(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const end = () => {
    drawing.current = false;
    const dataUrl = canvasRef.current?.toDataURL('image/png') || null;
    onChange({ ...value, dataUrl });
  };

  const clear = () => {
    const ctx = getCtx();
    const c = canvasRef.current;
    if (!ctx || !c) return;
    ctx.clearRect(0, 0, c.width, c.height);
    onChange({ ...value, dataUrl: null });
  };

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    // initial crisp size
    c.width = c.clientWidth * 2;
    c.height = 160 * 2;
    const ctx = getCtx();
    if (ctx) ctx.scale(2, 2);
  }, []);

  const pointFromEvent = (e: any) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: { xs: 2, sm: 3 } }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        Signature
      </Typography>
      <Box
        sx={{
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: 1.5,
          p: 1,
          backgroundColor: 'background.paper',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
          style={{ width: '100%', height: 160, display: 'block', cursor: 'crosshair' }}
        />
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} gap={1.5} sx={{ mt: 1 }}>
        <TextField
          label="Date"
          type="date"
          size="small"
          fullWidth
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="outlined" onClick={clear}>Clear</Button>
      </Stack>
    </Paper>
  );
}
