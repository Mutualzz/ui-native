import type { Theme } from "@emotion/react";
import {
    dynamicElevation,
    formatColor,
    isValidGradient,
    resolveColor,
    type Color,
    type ColorLike,
} from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";
import type { PaperVariant } from "./Paper.types";

export const resolvePaperStyles = (
    theme: Theme,
    color: Color | ColorLike,
    elevation: number,
    nonTranslucent: boolean,
): Record<PaperVariant, ViewStyle> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    return {
        elevation: {
            backgroundColor: isValidGradient(colors.surface)
                ? nonTranslucent
                    ? colors.surface
                    : formatColor(colors.surface, {
                          alpha: 20,
                          format: "rgba",
                      })
                : dynamicElevation(colors.surface, elevation),
            boxShadow: `0 ${2 + elevation}px ${8 + elevation * 2}px rgba(0,0,0,${0.1 + elevation * 0.05})`,
        },
        solid: {
            backgroundColor: formatColor(resolvedColor, {
                format: "rgba",
            }),
            borderWidth: 0,
        },
        outlined: {
            borderWidth: 1,
            borderColor:
                formatColor(resolvedColor, { alpha: 30, format: "rgba" }) ||
                "transparent",
            borderStyle: "solid",
        },
        plain: {
            backgroundColor: "transparent",
            borderWidth: 0,
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                alpha: 20,
                format: "rgba",
            }),
            borderWidth: 0,
        },
    };
};
