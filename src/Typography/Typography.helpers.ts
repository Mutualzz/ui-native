import type { Theme } from "@emotion/react";
import {
    createColor,
    formatColor,
    isValidColorInput,
    resolveColor,
    resolveTypographyColor,
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";

import type { TextStyle } from "react-native";
import type { TypographyVariant } from "./Typography.types";

export const resolveTypographyStyles = (
    theme: Theme,
    color: Color | ColorLike,
    textColor: TypographyColor | ColorLike,
): Record<TypographyVariant, TextStyle> => {
    const resolvedColor = resolveColor(color, theme);

    const parsedTextColor = resolveTypographyColor(textColor, theme);

    const isColorLike = isValidColorInput(parsedTextColor);

    const isDark = createColor(resolvedColor).isDark();
    const solidTextColor = isDark
        ? formatColor(theme.typography.colors.primary, { format: "hexa" })
        : formatColor(resolvedColor, { format: "hexa", darken: 70 });

    const textColorFinal = formatColor(
        isColorLike ? parsedTextColor : theme.typography.colors.primary,
        { format: "hexa" },
    );

    const hex = formatColor(resolvedColor, { format: "hexa" });

    return {
        solid: {
            backgroundColor: hex,
            color: solidTextColor,
        },
        outlined: {
            backgroundColor: "transparent",
            color: hex,
            borderWidth: 1,
            borderColor: hex,
        },
        plain: {
            backgroundColor: "transparent",
            color: hex,
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 40,
            }),
            color: hex,
        },
        none: {
            backgroundColor: "transparent",
            color: textColorFinal,
        },
    };
};
