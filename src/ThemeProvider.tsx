import {
    ThemeProvider as EmotionThemeProvder,
    type Theme,
} from "@emotion/react";
import type { ThemeType } from "@mutualzz/ui-core";
import { baseDarkTheme, baseLightTheme } from "@mutualzz/ui-core";
import {
    createContext,
    forwardRef,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext({
    theme: baseDarkTheme,
    changeTheme: (_theme: Theme | null) => {
        return;
    },
    type: null as ThemeType | null,
});

export interface ThemeProviderRef {
    theme: Theme;
    type: ThemeType | null;
    changeTheme: (theme: Theme | null) => void;
}

const ThemeProvider = forwardRef<
    ThemeProviderRef,
    PropsWithChildren & {
        onThemeChange?: (theme: Theme, type: ThemeType | null) => void;
    }
>(({ children, onThemeChange }, ref) => {
    const [type, setType] = useState<ThemeType | null>(null);

    const [theme, setTheme] = useState<Theme>(baseDarkTheme);
    const [mounted, setMounted] = useState(false);
    const prefersDark = useColorScheme() === "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    const changeTheme = (newTheme: Theme | null) => {
        if (!newTheme) {
            const preferredTheme = prefersDark ? baseDarkTheme : baseLightTheme;
            setTheme(preferredTheme);
            setType(null);
            onThemeChange?.(preferredTheme, null);
            return;
        }

        setTheme(newTheme);
        setType(newTheme.type);

        onThemeChange?.(newTheme, newTheme.type);
    };

    useImperativeHandle(ref, () => ({
        theme,
        type,
        changeTheme,
    }));

    const value = useMemo(
        () => ({
            theme,
            changeTheme,
            type,
        }),
        [type, theme],
    );

    if (!mounted) return null;

    return (
        <ThemeContext.Provider value={value}>
            <EmotionThemeProvder theme={theme}>{children}</EmotionThemeProvder>
        </ThemeContext.Provider>
    );
});

export { ThemeProvider };
