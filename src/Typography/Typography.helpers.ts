import type { Theme } from "@emotion/react";
import {
    alpha,
    darken,
    getLuminance,
    isValidColorInput,
    resolveColor,
    resolveTypographyColor,
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";
import { formatHex8 } from "culori";

export const resolveTypographStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike | "inherit",
) => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor =
        textColor === "inherit"
            ? theme.typography.colors.primary
            : resolveTypographyColor(textColor, theme);

    const isColorLike = isValidColorInput(parsedTextColor);
    const luminance = getLuminance(resolvedColor) ?? 0;
    const solidTextColor =
        luminance < 0.5
            ? formatHex8(colors.common.white)
            : darken(resolvedColor, 0.7);

    const textColorFinal = formatHex8(
        isColorLike ? parsedTextColor : theme.typography.colors.primary,
    );

    return {
        solid: {
            backgroundColor: formatHex8(resolvedColor),
            color: solidTextColor,
            border: "none",
        },
        outlined: {
            backgroundColor: "transparent",
            color: formatHex8(resolvedColor),
            border: `1px solid ${formatHex8(resolvedColor)}`,
        },
        plain: {
            backgroundColor: "transparent",
            color: formatHex8(resolvedColor),
            border: "none",
        },
        soft: {
            backgroundColor: formatHex8(alpha(resolvedColor, 0.4)),
            color: formatHex8(resolvedColor),
            border: "none",
        },
        none: {
            backgroundColor: "transparent",
            border: "none",
            color: textColorFinal,
        },
    };
};
