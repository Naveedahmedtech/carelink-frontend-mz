// theme.ts
import { createTheme } from '@mui/material/styles';
import '@mui/x-date-pickers/themeAugmentation';

export const theme = createTheme({
  palette: {
    primary: { main: '#E31E68', dark: '#c71856', contrastText: '#ffffff' },
    text: { primary: '#1f1f1f', secondary: '#6b7280' },
    error: { main: '#ef4444' },
  },
  components: {
    /* Inputs (Start/End) */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#E31E68' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#E31E68' },
          '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(227, 30, 104, 0.10)' },
        },
        notchedOutline: { borderColor: 'var(--color-border)' },
        input: { color: '#0d0d0d' },
      },
    },
    /* Clock icon color */
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': { color: '#9ca3af' },
          '&:hover .MuiSvgIcon-root': { color: '#E31E68' },
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
          '& .MuiPickersArrowSwitcher-button:hover': { color: '#E31E68' },

          /* Action bar (CANCEL/OK) */
          '& .MuiPickersActionBar-root': {
            borderTop: '1px solid var(--color-border)',
            paddingInline: 8,
            '& .MuiButton-root': { textTransform: 'none', fontWeight: 700 },
            /* CANCEL */
            '& .MuiButton-root:first-of-type': {
              color: '#E31E68',
              '&:hover': { backgroundColor: '#fdf2f7' },
            },
            /* OK */
            '& .MuiButton-root:last-of-type': {
              color: '#fff',
              backgroundColor: '#E31E68',
              borderRadius: 12,
              paddingInline: 12,
              '&:hover': { backgroundColor: '#c71856' },
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
            '&:hover': { backgroundColor: '#fdf2f7' },
            '&.Mui-selected': { backgroundColor: '#E31E68', color: '#fff' },
          },

          /* Single-column digital clock */
          '& .MuiDigitalClock-item.Mui-selected': {
            backgroundColor: '#E31E68', color: '#fff',
          },

          /* Analog clock */
          '& .MuiTimeClock-root .MuiClockNumber-root.Mui-selected': {
            backgroundColor: '#E31E68', color: '#fff',
          },
          '& .MuiClock-pin, & .MuiClockPointer-root, & .MuiClockPointer-thumb': {
            backgroundColor: '#E31E68', borderColor: '#E31E68',
          },
        },
      },
    },
  },
});
