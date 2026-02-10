import type { Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    createColor,
    formatColor,
    resolveColor,
    resolveSize,
} from "@mutualzz/ui-core";
import type { TextStyle } from "react-native";

export const baseSizeMap: Record<Size, number> = {
    sm: 40,
    md: 48,
    lg: 56,
};

export const resolveSelectSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const s = resolveSize(theme, size, baseSizeMap);

    return {
        minHeight: s,
        fontSize: s * 0.32,
        paddingHorizontal: s * 0.25,
        paddingVertical: s * 0.12,
        minWidth: s * 3,
        gap: s * 0.15,
    };
};

export const resolveSelectStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, TextStyle> => {
    const resolvedColor = resolveColor(color, theme);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            backgroundColor: formatColor(resolvedColor),
            color: solidTextColor,
        },
        outlined: {
            borderWidth: 1,
            borderColor: formatColor(resolvedColor),
            backgroundColor: "transparent",
            color: formatColor(resolvedColor, { lighten: 75 }),
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                darken: 50,
            }),
            color: formatColor(resolvedColor, { lighten: 75 }),
        },
        plain: {
            backgroundColor: "transparent",
            color: formatColor(resolvedColor, { lighten: 75 }),
        },
    };
};

export const resolveSelectContentStyles = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: formatColor(resolvedColor),
            color: formatColor(theme.typography.colors.primary, {
                negate: createColor(resolvedColor).isLight(),
            }),
        },
        outlined: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: formatColor(resolvedColor),
            color: formatColor(resolvedColor, { lighten: 20 }),
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                darken: 50,
            }),
            color: formatColor(resolvedColor, { lighten: 20 }),
        },
        plain: {
            backgroundColor: colors.background,
            color: formatColor(resolvedColor),
        },
    };
};
