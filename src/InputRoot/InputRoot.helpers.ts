import type { Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    TypographyColor,
    Variant,
} from "@mutualzz/ui-core";
import {
    createColor,
    formatColor,
    isValidColorInput,
    resolveColor,
    resolveSize,
    resolveTypographyColor,
} from "@mutualzz/ui-core";
import type { TextStyle } from "react-native";

export const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 14,
    lg: 16,
};

export const resolveInputRootSize = (
    theme: Theme,
    size: Size | SizeValue | number,
    fullWidth?: boolean,
): TextStyle => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: fullWidth ? "100%" : resolvedSize * 16,
        maxWidth: "100%",
        fontSize: resolvedSize,
        lineHeight: 1.2,
        minHeight: resolvedSize * 2.2,
        paddingVertical: resolvedSize * 0.4,
        paddingHorizontal: resolvedSize * 0.6,
    };
};

export const resolveInputRootStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
    error: boolean,
): Record<Variant, TextStyle> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor =
        textColor === "inherit"
            ? theme.typography.colors.primary
            : resolveTypographyColor(textColor, theme);

    const errorColor = colors.danger;
    const activeColor = error ? errorColor : resolvedColor;
    const isColorLike = isValidColorInput(parsedTextColor);

    const isDark = createColor(activeColor).isDark();
    const solidTextColor = isDark
        ? formatColor(theme.typography.colors.primary, {
              format: "rgba",
          })
        : formatColor(activeColor, {
              darken: 70,
              format: "rgba",
          });

    const textColorFinal = formatColor(
        isColorLike ? parsedTextColor : theme.typography.colors.primary,
        {
            format: "rgba",
        },
    );

    return {
        outlined: {
            backgroundColor: "transparent",
            color: textColorFinal,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: formatColor(activeColor, {
                format: "rgba",
            }),
        },
        solid: {
            backgroundColor: formatColor(activeColor, {
                format: "rgba",
            }),
            color: solidTextColor,
            borderWidth: 0,
        },
        soft: {
            backgroundColor: formatColor(activeColor, {
                alpha: 10,
                format: "rgba",
            }),
            color: formatColor(activeColor, {
                format: "rgba",
            }),
            borderWidth: 0,
        },
        plain: {
            backgroundColor: "transparent",
            color: textColorFinal,
            borderWidth: 0,
        },
    };
};
