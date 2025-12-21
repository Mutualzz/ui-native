import type { Theme } from "@emotion/react";
import type { Size, SizeValue } from "@mutualzz/ui-core";
import { resolveSize } from "@mutualzz/ui-core";
import type { TextStyle } from "react-native";

export const baseSizeMap: Record<Size, number> = {
    sm: 14,
    md: 16,
    lg: 18,
};

export const resolveInputBaseSize = (
    theme: Theme,
    size: Size | SizeValue | number = "md",
    fullWidth?: boolean,
): TextStyle => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: resolvedSize,
        flexGrow: fullWidth ? 1 : 0,
        flexShrink: 1,
        minWidth: 0,
    };
};
