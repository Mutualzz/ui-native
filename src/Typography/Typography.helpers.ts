import type { Theme } from "@emotion/react";
import {
    formatColor,
    isValidColorInput,
    resolveColor,
    resolveTypographyColor,
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";
import ColorPkg from "color";
import type { TextStyle } from "react-native";
import type { TypographyVariant } from "./Typography.types";

export const resolveTypographStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
): Record<TypographyVariant, TextStyle> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor =
        textColor === "inherit"
            ? theme.typography.colors.primary
            : resolveTypographyColor(textColor, theme);

    const isColorLike = isValidColorInput(parsedTextColor);
    const luminance = ColorPkg(resolvedColor).luminosity();
    const solidTextColor =
        luminance < 0.5
            ? formatColor(colors.common.white)
            : formatColor(resolvedColor, {
                  darken: 70,
                  format: "rgba",
              });

    const textColorFinal = formatColor(
        isColorLike ? parsedTextColor : theme.typography.colors.primary,
        { format: "rgba" },
    );

    return {
        solid: {
            backgroundColor: formatColor(resolvedColor, { format: "rgba" }),
            color: solidTextColor,
            borderWidth: 0,
        },
        outlined: {
            backgroundColor: "transparent",
            color: formatColor(resolvedColor, { format: "rgba" }),
            borderWidth: 1,
            borderColor: formatColor(resolvedColor, { format: "rgba" }),
            borderStyle: "solid",
        },
        plain: {
            backgroundColor: "transparent",
            color: formatColor(resolvedColor, { format: "rgba" }),
            borderWidth: 0,
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                alpha: 40,
            }),
            color: formatColor(resolvedColor, { format: "rgba" }),
            borderWidth: 0,
        },
        none: {
            backgroundColor: "transparent",
            borderWidth: 0,
            color: textColorFinal,
        },
    };
};
