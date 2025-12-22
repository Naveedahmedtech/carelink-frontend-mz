import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): Theme => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === 'undefined') return 'dark';
        const stored = window.localStorage.getItem('theme') as Theme | null;
        const initial = stored || getSystemTheme() || 'dark';
        document.documentElement.classList.toggle('dark', initial === 'dark');
        return initial;
    });

    useEffect(() => {
        const localTheme = window.localStorage.getItem('theme') as Theme | null;
        if (localTheme) {
            setTheme(localTheme);
        } else {
            setTheme(getSystemTheme());
        }

        const themeChangeHandler = (e: MediaQueryListEvent) => {
            // Only follow system changes when user hasn't chosen a theme
            if (!window.localStorage.getItem('theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.classList.toggle('dark', newTheme === 'dark');
                setTheme(newTheme);
            }
        };

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', themeChangeHandler);
        } else {
            // Safari fallback
            // @ts-ignore
            mediaQuery.addListener(themeChangeHandler);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', themeChangeHandler);
            } else {
                // @ts-ignore
                mediaQuery.removeListener(themeChangeHandler);
            }
        };
    }, []);

    const toggleTheme = useCallback(() => {
        const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        setTheme(newTheme);
        window.localStorage.setItem('theme', newTheme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
