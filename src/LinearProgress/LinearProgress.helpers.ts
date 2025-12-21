import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import { formatColor, resolveColor, resolveSize } from "@mutualzz/ui-core";

export const resolveLinearProgressStyles = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const resolvedColor = resolveColor(color, theme);

    return {
        plain: "transparent",
        solid: formatColor(resolvedColor, {
            alpha: 20,
            format: "hexa",
        }),
        soft: formatColor(resolvedColor, {
            alpha: 15,
            format: "hexa",
        }),
        outlined: "transparent",
    };
};

export const thicknessMap: Record<Size, number> = {
    sm: 6,
    md: 8,
    lg: 12,
};

export const lengthMap: Record<Size, number> = {
    sm: 140,
    md: 200,
    lg: 260,
};

export const resolveLinearProgressThickness = (
    theme: Theme,
    thickness: Size | SizeValue | number,
) => resolveSize(theme, thickness, thicknessMap);

export const resolveLinearProgressLength = (
    theme: Theme,
    length: Size | SizeValue | number,
) => resolveSize(theme, length, lengthMap);
