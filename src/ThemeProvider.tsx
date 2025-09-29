import {
    ThemeProvider as EmotionThemeProvder,
    type Theme,
} from "@emotion/react";
import type { ThemeMode } from "@mutualzz/ui-core";
import {
    baseDarkTheme,
    baseLightTheme,
    themes as baseThemes,
} from "@mutualzz/ui-core";
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
    theme: baseThemes.find((theme) => theme.id === "baseDark") ?? baseThemes[0],
    changeTheme: (_theme: Theme) => {
        return;
    },
    mode: "system" as ThemeMode,
    changeMode: (_mode: ThemeMode) => {
        return;
    },
});

export interface ThemeProviderRef {
    changeTheme: (theme: Theme) => void;
    changeMode: (mode: ThemeMode) => void;
}

const ThemeProvider = forwardRef<
    ThemeProviderRef,
    PropsWithChildren & {
        onThemeChange?: (theme: Theme) => void;
        onModeChange?: (mode: ThemeMode) => void;
        disableDefaultThemeOnModeChange?: boolean;
    }
>(
    (
        {
            children,
            onThemeChange,
            onModeChange,
            disableDefaultThemeOnModeChange = false,
        },
        ref,
    ) => {
        const colorScheme = useColorScheme();
        const prefersDark = colorScheme === "dark";

        const [theme, setTheme] = useState<Theme | null>(null);
        const [mode, setMode] = useState<ThemeMode>("system");

        useEffect(() => {
            if (mode !== "system") return;
            // follow system
            setTheme(prefersDark ? baseDarkTheme : baseLightTheme);
        }, [mode, prefersDark]);

        const changeMode = (mode: ThemeMode) => {
            setMode(mode);

            if (!disableDefaultThemeOnModeChange) {
                if (mode === "system")
                    setTheme(prefersDark ? baseDarkTheme : baseLightTheme);
                else if (mode === "dark") setTheme(baseDarkTheme);
                else setTheme(baseLightTheme);
            }

            onModeChange?.(mode);
        };

        const changeTheme = (theme: Theme) => {
            setTheme(theme);
            onThemeChange?.(theme);
        };

        useImperativeHandle(ref, () => ({
            changeTheme,
            changeMode,
        }));

        const themeObject =
            theme ??
            (prefersDark != null
                ? prefersDark
                    ? baseDarkTheme
                    : baseLightTheme
                : baseDarkTheme);

        const value = useMemo(
            () => ({
                theme: themeObject,
                changeTheme,
                mode,
                changeMode,
            }),
            [mode, themeObject],
        );

        return (
            <ThemeContext.Provider value={value}>
                <EmotionThemeProvder theme={themeObject}>
                    {children}
                </EmotionThemeProvder>
            </ThemeContext.Provider>
        );
    },
);

ThemeProvider.displayName = "ThemeProvider";

export { ThemeProvider };
