import type { Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { formatColor, resolveColor, resolveSize } from "@mutualzz/ui-core";

export const baseSizeMap: Record<Size, number> = {
    sm: 40,
    md: 48,
    lg: 64,
};

const strokeWidthSizeMap: Record<Size, number> = {
    sm: 2,
    md: 4,
    lg: 6,
};

export const resolveCircularProgressOuterStroke = (
    theme: Theme,
    color: Color | ColorLike,
): Record<Variant, { stroke: string }> => {
    const resolvedColor = resolveColor(color, theme);

    return {
        plain: { stroke: "transparent" },
        solid: {
            stroke: formatColor(resolvedColor, { alpha: 50, format: "hexa" }),
        },
        soft: {
            stroke: formatColor(resolvedColor, { alpha: 10, format: "hexa" }),
        },
        outlined: { stroke: "transparent" },
    };
};

export const resolveCircularProgressSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => resolveSize(theme, size, baseSizeMap);

export const calculateCircle = (
    theme: Theme,
    size: Size | SizeValue | number,
    value: number,
    contentDiameter: number,
    strokeWidth: Size | SizeValue | number | undefined,
) => {
    const baseDiameter = resolveCircularProgressSize(theme, size);
    const strokeWidthValue = strokeWidth
        ? resolveSize(theme, strokeWidth, strokeWidthSizeMap)
        : Math.max(2, baseDiameter * 0.1);

    const diameter = contentDiameter
        ? contentDiameter + strokeWidthValue + 8 * 2
        : baseDiameter;

    const radius = (diameter - strokeWidthValue) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedValue = Math.min(Math.max(value, 0), 100);
    const dashOffset = ((100 - clampedValue) / 100) * circumference;

    return {
        baseDiameter,
        strokeWidthValue,
        diameter,
        radius,
        circumference,
        dashOffset,
    };
};
