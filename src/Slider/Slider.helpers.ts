import type { Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { formatColor, resolveColor, resolveSize } from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

const thumbSizeMap: Record<Size, number> = { sm: 24, md: 32, lg: 40 };

export const resolveSliderThumbSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const sizeVal = resolveSize(theme, size, thumbSizeMap);

    return { width: sizeVal, height: sizeVal, borderRadius: sizeVal / 2 };
};

export const resolveSliderTrackThickness = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const sizeVal = resolveSize(theme, size, thumbSizeMap);

    return Math.round(sizeVal / 3);
};

export const resolveSliderTickSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const sizeVal = resolveSize(theme, size, thumbSizeMap);

    const thumbSize = Math.round(sizeVal * 0.25);

    return { width: thumbSize, height: thumbSize };
};

export const resolveSliderLabelSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const baseFontMap: Record<Size, number> = {
        sm: theme.typography.levels["body-xs"].fontSize,
        md: theme.typography.levels["body-sm"].fontSize,
        lg: theme.typography.levels["body-md"].fontSize,
    };

    return resolveSize(theme, size, baseFontMap);
};

export const resolveSliderTrackStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hovered: boolean,
): Record<Variant, ViewStyle> => {
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: hovered
                ? formatColor(resolvedColor, { alpha: 90, format: "hexa" })
                : formatColor(resolvedColor),
        },
        outlined: {
            borderWidth: 1,
            borderColor: hovered
                ? formatColor(resolvedColor, { format: "hexa", alpha: 70 })
                : formatColor(resolvedColor),
            backgroundColor: hovered
                ? formatColor(resolvedColor, { alpha: 10, format: "hexa" })
                : "transparent",
        },
        plain: {
            backgroundColor: hovered
                ? formatColor(resolvedColor, { alpha: 20, format: "hexa" })
                : "transparent",
        },
        soft: {
            backgroundColor: hovered
                ? formatColor(resolvedColor, { alpha: 20, format: "hexa" })
                : formatColor(resolvedColor, { alpha: 10, format: "hexa" }),
        },
    };
};

export const resolveSliderThumbStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hovered: boolean,
): Record<Variant, ViewStyle> => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            backgroundColor: colors.common.white,
            borderWidth: 2,
            borderColor: hovered
                ? formatColor(resolvedColor, { format: "hexa", alpha: 90 })
                : formatColor(resolvedColor),
        },
        outlined: {
            backgroundColor: colors.common.white,
            borderWidth: 2,
            borderColor: formatColor(resolvedColor),
        },
        plain: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 80,
            }),
        },
        soft: {
            backgroundColor: hovered
                ? formatColor(resolvedColor, { format: "hexa", lighten: 50 })
                : formatColor(resolvedColor, { format: "hexa", lighten: 70 }),
            borderWidth: 2,
            borderColor: hovered
                ? formatColor(resolvedColor, { alpha: 85, format: "hexa" })
                : formatColor(resolvedColor),
        },
    };
};
