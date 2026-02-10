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

const padYMap: Record<Size, number> = { sm: 14, md: 18, lg: 22 };
const padXMap: Record<Size, number> = { sm: 16, md: 20, lg: 24 };

export const resolveListItemButtonSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): ViewStyle => {
    const py = resolveSize(theme, size, padYMap);
    const px = resolveSize(theme, size, padXMap);

    return {
        paddingVertical: py,
        paddingHorizontal: px,
        minHeight: 40,
    };
};

export const resolveListItemButtonContainerStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, ViewStyle> => {
    const resolved = resolveColor(color, theme);
    const hex = formatColor(resolved);

    return {
        solid: { backgroundColor: hex },
        soft: {
            backgroundColor: formatColor(resolved, {
                alpha: 12,
                format: "hexa",
            }),
        },
        plain: { backgroundColor: "transparent" },
        outlined: { backgroundColor: "transparent", borderWidth: 0 },
    };
};
