import { type Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import {
    formatColor,
    resolveColor,
    resolveColorFromLuminance,
} from "@mutualzz/ui-core";
import ColorPkg from "color";
import type { TextStyle, ViewStyle } from "react-native";

export function resolveButtonContainerStyles(
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, ViewStyle> {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

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
                format: "hexa",
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
    const textColor = resolveColorFromLuminance(ColorPkg(resolvedColor), theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    return {
        solid: {
            color: textColor,
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
