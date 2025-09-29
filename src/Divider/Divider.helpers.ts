import type { Theme } from "@emotion/react";
import type { Color, ColorLike, TypographyColor } from "@mutualzz/ui-core";
import {
    isThemeColor,
    isTypographyColor,
    resolveColor,
    resolveTypographyColor,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";
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
          : resolveColor(color, theme);

    const hexColor = formatHex8(resolvedColor);
    if (!hexColor) return color;

    return hexColor;
};

export const resolveDividerStyles = (
    isVertical: boolean,
    lineColor: string,
): Record<DividerVariant, ViewStyle> => {
    return {
        dashed: {
            ...(isVertical
                ? {
                      width: 1,
                      borderLeftWidth: 1,
                      borderLeftColor: lineColor,
                      borderStyle: "dashed",
                  }
                : {
                      height: 1,
                      borderTopWidth: 1,
                      borderTopColor: lineColor,
                      borderStyle: "dashed",
                  }),
        },
        dotted: {
            ...(isVertical
                ? {
                      width: 1,
                      borderLeftWidth: 1,
                      borderLeftColor: lineColor,
                      borderStyle: "dotted",
                  }
                : {
                      height: 1,
                      borderTopWidth: 1,
                      borderTopColor: lineColor,
                      borderStyle: "dotted",
                  }),
        },
        double: {
            ...(isVertical
                ? {
                      width: 3,
                      borderLeftWidth: 1,
                      borderRightWidth: 1,
                      borderLeftColor: lineColor,
                      borderRightColor: lineColor,
                      borderStyle: "solid",
                  }
                : {
                      height: 3,
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderTopColor: lineColor,
                      borderBottomColor: lineColor,
                      borderStyle: "solid",
                  }),
        },
        solid: {
            ...(isVertical ? { width: 1 } : { height: 1 }),
            backgroundColor: lineColor,
        },
    };
};
