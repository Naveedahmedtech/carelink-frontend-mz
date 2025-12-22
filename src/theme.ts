// theme.ts
import { createTheme } from '@mui/material/styles';
import '@mui/x-date-pickers/themeAugmentation';

export const readCssVar = (name: string, fallback: string) => {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
};

// Factory function to create theme
export const createAppTheme = (mode?: 'light' | 'dark') => {
  // MUI palette MUST use concrete colors for lighten/darken operations.
  // Read CSS variables and pass their resolved values into the palette.
  const isDark =
    mode === 'dark' ||
    (typeof window !== 'undefined' && document.documentElement.classList.contains('dark'));

  const primaryMain = readCssVar('--color-primary', '#12D3B0');
  const primaryDark = readCssVar('--color-hover', '#0FAE94');
  const primaryContrast = readCssVar('--color-text-hover', '#ffffff');
  const textPrimary = readCssVar('--color-text', isDark ? '#f9fafb' : '#1f1f1f');
  const textSecondary = readCssVar('--color-text-secondary', '#9ca3af');
  const backgroundDefault = readCssVar('--color-background', isDark ? '#111827' : '#f9fafb');
  const backgroundPaper = readCssVar('--color-background-shade-1', isDark ? '#1f2937' : '#ffffff');
  const errorMain = readCssVar('--color-error', '#ef4444');

  return createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
    primary: { main: primaryMain, dark: primaryDark, contrastText: primaryContrast },
    background: { paper: backgroundPaper, default: backgroundDefault },
    text: { primary: textPrimary, secondary: textSecondary },
    error: { main: errorMain },
  },
  components: {
    /* Inputs (Start/End) */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#12D3B0' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#12D3B0' },
          '&.Mui-focused': { boxShadow: '0 0 0 4px var(--color-shadow)' },
        },
        notchedOutline: { borderColor: 'var(--color-border)' },
        input: { color: 'var(--color-text)' },
      },
    },
    /* Clock icon color */
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': { color: '#9ca3af' },
          '&:hover .MuiSvgIcon-root': { color: '#12D3B0' },
        },
      },
    },

    /* 🔥 One place to brand the entire picker (no ActionBar key needed) */
    MuiPickersLayout: {
      styleOverrides: {
        root: {
          /* Toolbar */
          '& .MuiPickersToolbar-root': {
            backgroundColor: 'var(--color-background-shade-2)',
          },
          '& .MuiPickersToolbar-root .MuiTypography-root': {
            color: 'var(--color-text-dark)',
          },
          '& .MuiPickersArrowSwitcher-button:hover': { color: '#12D3B0' },

          /* Action bar (CANCEL/OK) */
          '& .MuiPickersActionBar-root': {
            borderTop: '1px solid var(--color-border)',
            paddingInline: 8,
            '& .MuiButton-root': { textTransform: 'none', fontWeight: 700 },
            /* CANCEL */
            '& .MuiButton-root:first-of-type': {
              color: '#12D3B0',
              '&:hover': { backgroundColor: 'var(--color-background-shade-2)' },
            },
            /* OK */
            '& .MuiButton-root:last-of-type': {
              color: '#fff',
              backgroundColor: '#12D3B0',
              borderRadius: 12,
              paddingInline: 12,
              '&:hover': { backgroundColor: '#0FAE94' },
            },
          },

          /* Multi-section wheel (H | M | AM/PM) */
          '& .MuiMultiSectionDigitalClockSection-root': {
            borderRight: '1px solid var(--color-border)',
            '&:last-of-type': { borderRight: 'none' },
          },
          '& .MuiMultiSectionDigitalClockSection-item': {
            borderRadius: 999,
            margin: '4px 8px',
            '&:hover': { backgroundColor: 'var(--color-background-shade-2)' },
            '&.Mui-selected': { backgroundColor: '#12D3B0', color: '#fff' },
          },

          /* Single-column digital clock */
          '& .MuiDigitalClock-item.Mui-selected': {
            backgroundColor: '#12D3B0', color: '#fff',
          },

          /* Analog clock */
          '& .MuiTimeClock-root .MuiClockNumber-root.Mui-selected': {
            backgroundColor: '#12D3B0', color: '#fff',
          },
          '& .MuiClock-pin, & .MuiClockPointer-root, & .MuiClockPointer-thumb': {
            backgroundColor: '#12D3B0', borderColor: '#12D3B0',
          },
        },
      },
    },
  },
  });
};
