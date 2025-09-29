import type { Theme } from "@emotion/react";
import {
    darken,
    getLuminance,
    lighten,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";
import { formatHex } from "culori";

export const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 48,
};

export const resolveSelectSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        container: {
            minHeight: resolvedSize,
            paddingHorizontal: resolvedSize * 0.25,
            paddingVertical: resolvedSize * 0.12,
            borderRadius: 6,
        },
        text: {
            fontSize: resolvedSize * 0.32,
        },
        popup: {
            minWidth: resolvedSize * 3,
            gap: resolvedSize * 0.15,
        },
    };
};

export const resolveSelectStyles = (theme: Theme, color: Color | ColorLike) => {
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: {
            container: {
                backgroundColor: formatHex(resolvedColor),
            },
            text: {
                color: formatHex(textColor),
            },
        },
        outlined: {
            container: {
                borderWidth: 1,
                borderColor: formatHex(resolvedColor),
                backgroundColor: "transparent",
            },
            text: { color: formatHex(lighten(resolvedColor, 0.75)) },
        },
        soft: {
            container: {
                backgroundColor: formatHex(darken(resolvedColor, 0.5)),
            },
            text: { color: formatHex(lighten(resolvedColor, 0.75)) },
        },
        plain: {
            container: { backgroundColor: "transparent" },
            text: { color: formatHex(lighten(resolvedColor, 0.75)) },
        },
    };
};

export const resolveSelectContentStyles = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: {
            surface: {
                backgroundColor: formatHex(resolvedColor),
            },
            item: {
                color: formatHex(textColor),
            },
        },
        outlined: {
            surface: {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: formatHex(resolvedColor),
            },
            item: { color: formatHex(lighten(resolvedColor, 0.2)) },
        },
        soft: {
            surface: { backgroundColor: formatHex(darken(resolvedColor, 0.5)) },
            itemTeitemxt: { color: formatHex(lighten(resolvedColor, 0.2)) },
        },
        plain: {
            surface: { backgroundColor: colors.surface },
            item: { color: formatHex(resolvedColor) },
        },
    };
};
