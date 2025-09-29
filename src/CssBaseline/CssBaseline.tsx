import { useEffect, type PropsWithChildren } from "react";
import { Platform, StatusBar, Text, TextInput } from "react-native";
import { useTheme } from "../useTheme";

export const CssBaseline = ({ children }: PropsWithChildren) => {
    const { theme } = useTheme();

    useEffect(() => {
        StatusBar.setBarStyle(
            theme.type === "dark" ? "light-content" : "dark-content",
        );

        try {
            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor(theme.colors.background, true);
            }
        } catch (error) {
            console.error("Error setting status bar:", error);
        }

        const baseTextStyle = {
            fontFamily: theme.typography.fontFamily,
            color: theme.typography.colors.primary,
            fontSize: theme.typography.levels["body-md"].fontSize,
            lineHeight: theme.typography.levels["body-md"].lineHeight,
        } as const;

        const TextAny = Text as any;
        TextAny.defaultProps = {
            ...(TextAny.defaultProps || {}),
            allowFontScaling: true,
            style: [TextAny.defaultProps?.style, baseTextStyle],
        };

        const TextInputAny = TextInput as any;
        TextInputAny.defaultProps = {
            ...(TextInputAny.defaultProps || {}),
            allowFontScaling: true,
            style: [TextInputAny.defaultProps?.style, baseTextStyle],
            placeholderTextColor: theme.typography.colors.secondary ?? "#888",
        };
    });

    return <>{children}</>;
};
