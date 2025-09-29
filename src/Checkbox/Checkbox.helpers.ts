import { type Theme } from "@emotion/react";
import {
    alpha,
    getLuminance,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";
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
    const hexColor = formatHex8(resolvedColor);

    return {
        solid: {
            backgroundColor: hexColor,
            borderColor: hexColor,
            borderWidth: 1,
        },
        outlined: {
            backgroundColor: checked
                ? formatHex8(alpha(resolvedColor, 0.1))
                : "transparent",
            borderColor: hexColor,
            borderWidth: 1,
        },
        soft: {
            backgroundColor: formatHex8(
                alpha(resolvedColor, checked ? 0.3 : 0.1),
            ),
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
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: textColor,
        outlined: formatHex8(resolvedColor) as string,
        soft: formatHex8(resolvedColor) as string,
        plain: formatHex8(resolvedColor) as string,
    };
};
