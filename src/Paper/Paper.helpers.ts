import type { Theme } from "@emotion/react";
import {
    dynamicElevation,
    flipNumber,
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

    variant: PaperVariant,
    elevation: number,
    transparency: number,
): Record<PaperVariant, ViewStyle> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const elevatedColor = dynamicElevation(
        variant === "solid" ? resolvedColor : colors.surface,
        elevation,
    );

    const isGradient = isValidGradient(elevatedColor);
    const gradientLayer = isGradient
        ? formatColor(elevatedColor, {
              alpha: flipNumber(transparency),
              format: "hexa",
          })
        : null;

    const opaqueBase = formatColor(colors.background);

    const elevatedBackgroundStyles: ViewStyle = isGradient
        ? {
              backgroundColor: opaqueBase,
          }
        : {
              backgroundColor: elevatedColor,
          };

    return {
        elevation: {
            ...elevatedBackgroundStyles,
            boxShadow: `0 ${2 + elevation}px ${8 + elevation * 2}px rgba(0,0,0,${0.1 + elevation * 0.05})`,
            elevation,
            shadowColor: "#000",
            shadowOpacity: Math.min(0.1 + elevation * 0.05, 0.5),
            shadowOffset: { width: 0, height: 2 + elevation },
            shadowRadius: 4 + elevation,
            borderRadius: 12,
            overflow: "hidden",
        },
        solid: {
            backgroundColor: formatColor(elevatedColor),
        },
        outlined: {
            ...(elevation === 0
                ? { backgroundColor: "transparent" }
                : elevatedBackgroundStyles),
            borderWidth: 1,
            borderColor: formatColor(resolvedColor, {
                alpha: 20,
                format: "hexa",
            }),
            borderStyle: "solid",
        },
        plain: {
            ...(elevation === 0
                ? { backgroundColor: "transparent" }
                : elevatedBackgroundStyles),
        },
        soft: {
            backgroundColor: formatColor(
                elevation === 0
                    ? resolvedColor
                    : (gradientLayer ?? resolvedColor),
                {
                    alpha: 10,
                    format: "hexa",
                },
            ),
        },
    };
};
