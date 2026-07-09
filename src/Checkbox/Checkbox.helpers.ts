import type { Theme } from "@emotion/react";
import {
    CONTROL_SIZE_MAP,
    createColor,
    formatColor,
    resolveColor,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

export const baseSizeMap = CONTROL_SIZE_MAP;

export const resolveCheckboxSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
    };
};

export interface CheckboxVisualStyle {
    box: ViewStyle;
    iconColor: string;
}

export const resolveCheckboxStyles = (
    theme: Theme,
    color: Color | ColorLike,
    checked?: boolean,
): Record<Variant, CheckboxVisualStyle> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: {
            box: {
                backgroundColor: checked ? hexColor : "transparent",
                borderWidth: 1,
                borderColor: hexColor,
            },
            iconColor: checked
                ? solidTextColor
                : formatColor(resolvedColor),
        },

        outlined: {
            box: {
                backgroundColor: checked
                    ? formatColor(resolvedColor, { alpha: 10, format: "hexa" })
                    : "transparent",
                borderWidth: 1,
                borderColor: formatColor(resolvedColor),
            },
            iconColor: formatColor(resolvedColor),
        },

        soft: {
            box: {
                backgroundColor: formatColor(resolvedColor, {
                    alpha: checked ? 30 : 10,
                    format: "hexa",
                }),
                borderWidth: 0,
            },
            iconColor: formatColor(resolvedColor),
        },

        plain: {
            box: {
                backgroundColor: "transparent",
                borderWidth: 0,
            },
            iconColor: formatColor(resolvedColor),
        },
    };
};

export const resolveIconScaling = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        width: resolvedSize * 0.5,
        height: resolvedSize * 0.5,
    };
};
