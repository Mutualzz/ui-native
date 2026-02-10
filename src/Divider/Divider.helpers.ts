import type { Theme } from "@emotion/react";
import {
    type Color,
    type ColorLike,
    formatColor,
    isThemeColor,
    isTypographyColor,
    resolveColor,
    resolveTypographyColor,
    type TypographyColor,
} from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";
import type { DividerVariant } from "./Divider.types";

export const resolveDividerColor = (
    theme: Theme,
    color: Color | ColorLike | TypographyColor,
) => {
    const resolvedColor = isThemeColor(color)
        ? resolveColor(color, theme)
        : isTypographyColor(color)
          ? resolveTypographyColor(color, theme)
          : color === "inherit" || color === "transparent"
            ? color
            : resolveColor(color, theme);

    return resolvedColor === "inherit" || resolvedColor === "transparent"
        ? resolvedColor
        : formatColor(resolvedColor);
};

export const resolveDividerStyles = (
    isVertical: boolean,
    lineColor: string,
): Record<DividerVariant, ViewStyle> => {
    if (isVertical) {
        return {
            solid: { backgroundColor: lineColor },
            dashed: {
                borderLeftWidth: 1,
                borderLeftColor: lineColor,
                borderStyle: "dashed",
            },
            dotted: {
                borderLeftWidth: 1,
                borderLeftColor: lineColor,
                borderStyle: "dotted",
            },
        };
    }

    return {
        solid: { backgroundColor: lineColor },
        dashed: {
            borderTopWidth: 1,
            borderTopColor: lineColor,
            borderStyle: "dashed",
        },
        dotted: {
            borderTopWidth: 1,
            borderTopColor: lineColor,
            borderStyle: "dotted",
        },
    };
};
