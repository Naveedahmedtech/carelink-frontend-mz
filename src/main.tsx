import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import NetworkStatus from './pages/NetworkStatus';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// 🔹 alias your app's context provider (no theme prop)
import { ThemeProvider as AppThemeProvider } from './context/ThemeContext';

// 🔹 bring MUI ThemeProvider (has the `theme` prop)
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AppThemeProvider>
        <MuiThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <NetworkStatus>
              <App />
            </NetworkStatus>
          </LocalizationProvider>
        </MuiThemeProvider>
      </AppThemeProvider>
    </Provider>
  </StrictMode>
);
