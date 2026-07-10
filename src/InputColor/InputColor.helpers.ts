import type { Theme } from "@emotion/react";
import {
    extractColors,
    formatColor,
    handleColor,
    isValidGradient,
    randomColor,
    resolveColor,
    resolveSize,
    type Color,
    type ColorLike,
    type HsvaColor,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = {
    sm: 16,
    md: 20,
    lg: 24,
};

export const toGradientStops = (color?: ColorLike | HsvaColor): HsvaColor[] => {
    if (!color) return [handleColor(randomColor("hex")).hsva];

    if (typeof color !== "string") return [color];

    const extracted = extractColors(color);
    if (extracted?.length) {
        return extracted.map((c) => handleColor(c).hsva);
    }

    return [handleColor(color).hsva];
};

export const resolveColorPickerButtonSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize,
        height: resolvedSize,
        minWidth: resolvedSize,
        minHeight: resolvedSize,
        borderRadius: resolvedSize * 0.25,
    };
};

export const resolveSwatchColor = (
    color: Color | ColorLike,
    theme: Theme,
): string => {
    const resolvedColor = resolveColor(color, theme);

    if (typeof resolvedColor === "string" && isValidGradient(resolvedColor)) {
        const extracted = extractColors(resolvedColor);
        if (extracted?.[0]) {
            return formatColor(extracted[0]) as string;
        }
    }

    return String(resolvedColor);
};

export const resolveColorPickerButtonStyles = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const resolvedColor = resolveSwatchColor(color, theme);

    return {
        solid: {
            backgroundColor: resolvedColor,
            borderWidth: 2,
            borderColor: theme.typography.colors.primary,
        },
        outlined: {
            backgroundColor: resolvedColor,
            borderWidth: 2,
            borderColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 60,
            }),
        },
        soft: {
            backgroundColor: resolvedColor,
            borderWidth: 2,
            borderColor: formatColor(theme.typography.colors.primary, {
                format: "hexa",
                alpha: 30,
            }),
        },
        plain: {
            backgroundColor: resolvedColor,
            borderWidth: 2,
            borderColor: "transparent",
        },
    };
};
