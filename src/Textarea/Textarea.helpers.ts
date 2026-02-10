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

const baseSizeMap: Record<Size, number> = { sm: 16, md: 18, lg: 20 };

export const resolveTextareaSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const sizeVal = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: sizeVal,
        minHeight: sizeVal * 4,
    };
};

export const resolveTextareaInputPadding = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const sizeVal = resolveSize(theme, size, baseSizeMap);

    return {
        paddingVertical: sizeVal * 0.5,
        paddingHorizontal: sizeVal * 0.75,
    };
};

export const resolveTextareaStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike,
    error?: boolean,
): Record<Variant, TextStyle> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor = resolveTypographyColor(textColor, theme);

    const isColorLike = isValidColorInput(parsedTextColor);

    const isDark = createColor(resolvedColor).isDark();
    const solidTextColor = isDark
        ? formatColor(theme.typography.colors.primary)
        : formatColor(resolvedColor, { darken: 70 });

    const textColorFinal = isColorLike
        ? parsedTextColor
        : theme.typography.colors.primary;

    const err = formatColor(colors.danger);

    const variants = {
        solid: {
            backgroundColor: formatColor(resolvedColor),
            color: solidTextColor as ColorLike | "transparent" | "inherit",
            borderWidth: 0,
        },
        outlined: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: formatColor(resolvedColor, {
                alpha: 30,
                format: "hexa",
            }),
            color: textColorFinal,
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                alpha: 10,
                format: "hexa",
            }),
            borderWidth: 0,
            color: textColorFinal,
        },
        plain: {
            backgroundColor: "transparent",
            borderWidth: 0,
            color: textColorFinal,
        },
    };

    if (error) {
        variants.outlined = {
            ...variants.outlined,
            borderColor: err,
        };
        variants.solid = {
            ...variants.solid,
            backgroundColor: formatColor(colors.danger, {
                alpha: 15,
                format: "hexa",
            }),
            color: textColorFinal,
        };
    }

    return variants;
};
