import { type Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import { formatColor, resolveColor } from "@mutualzz/ui-core";
import type { TextStyle, ViewStyle } from "react-native";

export function resolveButtonContainerStyles(
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, ViewStyle> {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "rgba" });

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
            backgroundColor: formatColor(resolvedColor, {
                alpha: 15,
                format: "rgba",
            }),
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
    const hexColor = formatColor(resolvedColor, { format: "rgba" });

    return {
        solid: {
            color: theme.typography.colors.primary,
        },
        outlined: {
            color: hexColor,
        },
        plain: {
            color: hexColor,
        },
        soft: {
            color: hexColor,
        },
    };
};
