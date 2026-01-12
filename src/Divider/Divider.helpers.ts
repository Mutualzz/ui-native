import type { Theme } from "@emotion/react";
import {
    type Color,
    type ColorLike,
    formatColor,
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
) =>
    formatColor(
        isTypographyColor(color)
            ? resolveTypographyColor(color, theme)
            : resolveColor(color, theme),
        { format: "hexa" },
    );

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
