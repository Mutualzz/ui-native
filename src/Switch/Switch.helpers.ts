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

// Shares Checkbox/Radio's box-size scale so a Switch sits at the same
// visual height as those controls when they appear together (e.g. in a
// settings list).
export const baseSizeMap = CONTROL_SIZE_MAP;

export const resolveSwitchDimensions = (
    theme: Theme,
    size: Size | SizeValue | number,
): { width: number; height: number; thumb: number; padding: number } => {
    const height = resolveSize(theme, size, baseSizeMap);
    const width = Math.round(height * 1.8);
    const padding = Math.max(2, Math.round(height * 0.15));
    const thumb = height - padding * 2;

    return { width, height, thumb, padding };
};

export const resolveSwitchTrackStyles = (
    theme: Theme,
    color: Color | ColorLike,
    checked: boolean,
): Record<Variant, ViewStyle & { thumbColor: string }> => {
    const onColor = resolveColor(color, theme);
    const offColor = resolveColor("neutral", theme);
    const trackColor = checked ? onColor : offColor;
    const trackHex = formatColor(trackColor);

    const thumbColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(trackColor).isLight(),
    });

    return {
        solid: {
            backgroundColor: formatColor(trackColor, {
                alpha: checked ? 100 : 35,
                format: checked ? "hex" : "hexa",
            }),
            borderWidth: 1,
            borderColor: trackHex,
            thumbColor,
        },
        outlined: {
            backgroundColor: checked
                ? formatColor(onColor, { alpha: 12, format: "hexa" })
                : "transparent",
            borderWidth: 1,
            borderColor: formatColor(trackColor),
            thumbColor,
        },
        soft: {
            backgroundColor: formatColor(trackColor, {
                alpha: checked ? 45 : 22,
                format: "hexa",
            }),
            borderWidth: 0,
            thumbColor,
        },
        plain: {
            backgroundColor: "transparent",
            borderWidth: 0,
            thumbColor,
        },
    };
};
