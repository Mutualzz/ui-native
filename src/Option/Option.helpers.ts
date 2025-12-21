import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import { formatColor, resolveColor, resolveSize } from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

const padYMap: Record<Size, number> = { sm: 12, md: 16, lg: 20 };
const padXMap: Record<Size, number> = { sm: 16, md: 20, lg: 24 };

export const resolveOptionSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): ViewStyle => {
    const py = resolveSize(theme, size, padYMap);
    const px = resolveSize(theme, size, padXMap);

    return {
        paddingVertical: py,
        paddingHorizontal: px,
        borderRadius: 8,
    };
};

export const resolveOptionStyles = (
    theme: Theme,
    color: Color | ColorLike,
    isSelected: boolean,
): Record<"plain" | "outlined" | "soft" | "solid", ViewStyle> => {
    const resolved = resolveColor(color, theme);
    const hex = formatColor(resolved, { format: "hexa" });

    const selectedBg = formatColor(resolved, { alpha: 20, format: "hexa" });

    return {
        plain: {
            backgroundColor: isSelected ? selectedBg : "transparent",
        },
        outlined: {
            backgroundColor: isSelected ? selectedBg : "transparent",
            borderWidth: 1,
            borderColor: hex,
        },
        soft: {
            backgroundColor: isSelected
                ? formatColor(resolved, { alpha: 30, format: "hexa" })
                : formatColor(resolved, { alpha: 12, format: "hexa" }),
        },
        solid: {
            backgroundColor: isSelected
                ? hex
                : formatColor(resolved, { alpha: 80, format: "hexa" }),
        },
    };
};
