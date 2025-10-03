import { type Theme } from "@emotion/react";
import {
    formatColor,
    resolveColor,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

export const baseSizeMap: Record<Size, number> = {
    sm: 12,
    md: 16,
    lg: 20,
};

export const resolveCheckboxSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): ViewStyle => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize,
        height: resolvedSize,
    };
};

export const resolveCheckboxStyles = (
    theme: Theme,
    color: Color | ColorLike,
    checked?: boolean,
): Record<Variant, ViewStyle> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor);

    return {
        solid: {
            backgroundColor: hexColor,
            borderColor: hexColor,
            borderWidth: 1,
        },
        outlined: {
            backgroundColor: checked
                ? formatColor(resolvedColor, { alpha: 10, format: "rgba" })
                : "transparent",
            borderColor: hexColor,
            borderWidth: 1,
        },
        soft: {
            backgroundColor: checked
                ? formatColor(resolvedColor, { alpha: 30, format: "rgba" })
                : formatColor(resolvedColor, { alpha: 10, format: "rgba" }),
            borderWidth: 0,
        },
        plain: {
            backgroundColor: "transparent",
            borderWidth: 0,
        },
    };
};

export const resolveIconScaling = (
    theme: Theme,
    size: Size | SizeValue | number,
): ViewStyle => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize * 0.5,
        height: resolvedSize * 0.5,
    };
};

export const resolveCheckboxColor = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "rgba" });

    return {
        solid: theme.typography.colors.primary,
        outlined: hexColor,
        soft: hexColor,
        plain: hexColor,
    };
};
