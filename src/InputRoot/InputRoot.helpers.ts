import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Variant } from "@mutualzz/ui-core";
import {
    formatColor,
    resolveColor,
    resolveSize,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

const basePadY: Record<Size, number> = { sm: 10, md: 14, lg: 18 };
const basePadX: Record<Size, number> = { sm: 14, md: 18, lg: 22 };

export const resolveInputRootLayout = (
    theme: Theme,
    size: Size | SizeValue | number,
): ViewStyle => {
    const py = resolveSize(theme, size, basePadY);
    const px = resolveSize(theme, size, basePadX);

    return {
        paddingVertical: py,
        paddingHorizontal: px,
        borderRadius: 8,
    };
};

export const resolveInputRootStyles = (
    theme: Theme,
    color: Color | ColorLike,
    error: boolean,
    readOnly: boolean,
): Record<Variant, ViewStyle> => {
    const baseColor = resolveColor(color, theme);
    const hex = formatColor(baseColor, { format: "hexa" });

    const danger = formatColor(resolveColor("danger", theme), {
        format: "hexa",
    });

    const borderColor = error ? danger : hex;

    const common: ViewStyle = {
        ...(readOnly ? { opacity: 0.9 } : null),
    };

    return {
        outlined: {
            ...common,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor,
        },
        solid: {
            ...common,
            backgroundColor: hex,
            borderWidth: 0,
        },
        soft: {
            ...common,
            backgroundColor: formatColor(baseColor, {
                alpha: 12,
                format: "hexa",
            }),
            borderWidth: 0,
        },
        plain: {
            ...common,
            backgroundColor: "transparent",
            borderWidth: 0,
        },
    };
};
