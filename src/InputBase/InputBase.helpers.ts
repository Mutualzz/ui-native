import type { Theme } from "@emotion/react";
import type { Size, SizeValue } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";
import type { TextStyle } from "react-native";

export const baseSizeMap: Record<Size, number> = {
    sm: 14,
    md: 16,
    lg: 18,
};

const basePadY: Record<Size, number> = { sm: 4, md: 8, lg: 12 };
const basePadX: Record<Size, number> = { sm: 2, md: 4, lg: 8 };

export const resolveInputBaseSize = (
    theme: Theme,
    size: Size | SizeValue | number,
): TextStyle => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);
    const py = resolveSize(theme, size, basePadY);
    const px = resolveSize(theme, size, basePadX);

    return {
        fontSize: resolvedSize,
        paddingVertical: py,
        paddingHorizontal: px,
    };
};
