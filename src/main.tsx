import { StrictMode, ReactNode, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import NetworkStatus from './pages/NetworkStatus';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// 🔹 alias your app's context provider (no theme prop)
import { ThemeProvider as AppThemeProvider, useTheme } from './context/ThemeContext';

// 🔹 bring MUI ThemeProvider (has the `theme` prop)
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createAppTheme } from './theme';
import AuthLoader from './router/components/AuthLoader';

const AppMuiThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();
  const muiTheme = useMemo(() => createAppTheme(theme), [theme]);

  return <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <AppMuiThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <NetworkStatus>
              <AuthLoader>
                <App />
              </AuthLoader>
            </NetworkStatus>
          </LocalizationProvider>
        </AppMuiThemeProvider>
      </AppThemeProvider>
    </Provider>
  </StrictMode>
);
