import type { Theme } from "@emotion/react";
import type { Color, ColorLike } from "@mutualzz/ui-core";
import { formatColor, resolveColor } from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

export const resolveListStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<"plain" | "outlined" | "soft" | "solid", ViewStyle> => {
    const resolved = resolveColor(color, theme);
    const hex = formatColor(resolved);

    return {
        plain: {
            backgroundColor: "transparent",
        },
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
        solid: {
            backgroundColor: hex,
        },
    };
};
