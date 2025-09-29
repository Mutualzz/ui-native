import type { Theme } from "@emotion/react";
import {
    alpha,
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
import { formatHex, formatHex8 } from "culori";

const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 48,
};

export const resolveOptionSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolved = resolveSize(theme, size, baseSizeMap);
    return {
        container: {
            paddingHorizontal: resolved * 0.25,
            paddingVertical: resolved * 0.15,
        },
        text: {
            fontSize: resolved * 0.32,
        },
    };
};

export const resolveOptionStyles = (
    theme: Theme,
    color: Color | ColorLike,
    isSelected: boolean,
) => {
    const resolvedColor = resolveColor(color, theme);
    const bgLum = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLum, theme);

    return {
        solid: {
            container: {
                backgroundColor: isSelected
                    ? formatHex(lighten(resolvedColor, 0.18))
                    : formatHex(resolvedColor),
            },
            text: { color: formatHex(textColor) },
        },
        outlined: {
            container: {
                backgroundColor: isSelected
                    ? formatHex8(alpha(lighten(resolvedColor, 0.15), 0.7))
                    : "transparent",
                borderTopWidth: 0,
            },
            text: { color: formatHex(lighten(resolvedColor, 0.8)) },
        },
        soft: {
            container: {
                backgroundColor: isSelected
                    ? formatHex8(alpha(lighten(resolvedColor, 0.15), 0.7))
                    : formatHex(lighten(resolvedColor, 0.08)),
            },
            text: { color: formatHex(lighten(resolvedColor, 0.8)) },
        },
        plain: {
            container: {
                backgroundColor: isSelected
                    ? formatHex8(alpha(lighten(resolvedColor, 0.15), 0.7))
                    : "transparent",
            },
            text: { color: formatHex(lighten(resolvedColor, 0.8)) },
        },
    };
};
