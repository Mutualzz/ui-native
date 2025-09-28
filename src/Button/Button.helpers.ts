import { type Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import {
    alpha,
    getLuminance,
    resolveColor,
    resolveColorFromLuminance,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";
import type { TextStyle, ViewStyle } from "react-native";

export function resolveButtonContainerStyles(
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, ViewStyle> {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatHex8(resolvedColor);

    return {
        solid: {
            backgroundColor: hexColor,
            borderWidth: 0,
            borderStyle: undefined,
            borderColor: "transparent",
        },
        outlined: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: hexColor,
        },
        plain: {
            backgroundColor: "transparent",
            borderWidth: 0,
            borderStyle: undefined,
            borderColor: "transparent",
        },
        soft: {
            backgroundColor: formatHex8(alpha(resolvedColor, 0.15)),
            borderWidth: 0,
            borderStyle: undefined,
            borderColor: "transparent",
        },
    };
}

export const resolveButtonTextStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, TextStyle> => {
    const resolvedColor = resolveColor(color, theme);
    const bgLuminance = getLuminance(resolvedColor);
    const textColor = resolveColorFromLuminance(bgLuminance, theme);

    return {
        solid: {
            color: textColor,
        },
        outlined: {
            color: formatHex8(resolvedColor),
        },
        plain: {
            color: formatHex8(resolvedColor),
        },
        soft: {
            color: formatHex8(resolvedColor),
        },
    };
};
