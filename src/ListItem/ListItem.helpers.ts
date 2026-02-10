import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import { formatColor, resolveColor, resolveSize } from "@mutualzz/ui-core";
import type { TextStyle, ViewStyle } from "react-native";

const padYMap: Record<Size, number> = { sm: 12, md: 16, lg: 20 };
const padXMap: Record<Size, number> = { sm: 16, md: 20, lg: 24 };

export const resolveListItemSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): ViewStyle => {
    const py = resolveSize(theme, size, padYMap);
    const px = resolveSize(theme, size, padXMap);

    return {
        paddingVertical: py,
        paddingHorizontal: px,
        borderRadius: 10,
    };
};

export const resolveListItemStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<"plain" | "outlined" | "soft" | "solid", ViewStyle> => {
    const resolved = resolveColor(color, theme);
    const hex = formatColor(resolved);

    return {
        plain: { backgroundColor: "transparent" },
        outlined: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: hex,
        },
        soft: {
            backgroundColor: formatColor(resolved, {
                alpha: 12,
                format: "hexa",
            }),
        },
        solid: { backgroundColor: hex },
    };
};

export const resolveListItemTextStyles = (
    theme: Theme,
    color: Color | ColorLike,
): TextStyle => {
    const resolved = resolveColor(color, theme);
    return { color: formatColor(resolved) };
};

export const isCssMarkerNative = (marker?: string) => {
    if (!marker) return false;
    return (
        marker === "disc" ||
        marker === "circle" ||
        marker === "square" ||
        marker === "none" ||
        marker === "decimal" ||
        marker === "decimal-leading-zero" ||
        marker === "lower-alpha" ||
        marker === "upper-alpha" ||
        marker === "lower-roman" ||
        marker === "upper-roman"
    );
};

export const cssMarkerToGlyph = (marker: string) => {
    switch (marker) {
        case "disc":
            return "•";
        case "circle":
            return "◦";
        case "square":
            return "▪";
        case "none":
            return "";
        default:
            return "•";
    }
};
