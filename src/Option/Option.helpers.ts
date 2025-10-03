import type { Theme } from "@emotion/react";
import {
    formatColor,
    resolveColor,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";

const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 48,
};

export const resolveOptionSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolved = resolveSize(theme, size, baseSizeMap);
    return {
        container: {
            paddingHorizontal: resolved * 0.25,
            paddingVertical: resolved * 0.15,
        },
        text: {
            fontSize: resolved * 0.32,
        },
    };
};

export const resolveOptionStyles = (
    theme: Theme,
    color: Color | ColorLike,
    isSelected: boolean,
) => {
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            container: {
                backgroundColor: isSelected
                    ? formatColor(resolvedColor, { alpha: 18, format: "rgba" })
                    : formatColor(resolvedColor, { format: "rgba" }),
            },
            text: {
                color: formatColor(theme.typography.colors.primary, {
                    format: "rgba",
                }),
            },
        },
        outlined: {
            container: {
                backgroundColor: isSelected
                    ? formatColor(resolvedColor, {
                          alpha: 70,
                          format: "rgba",
                          lighten: 15,
                      })
                    : "transparent",
                borderTopWidth: 0,
            },
            text: {
                color: formatColor(resolvedColor, {
                    format: "rgba",
                    lighten: 80,
                }),
            },
        },
        soft: {
            container: {
                backgroundColor: isSelected
                    ? formatColor(resolvedColor, {
                          alpha: 70,
                          format: "rgba",
                          lighten: 15,
                      })
                    : formatColor(resolvedColor, {
                          format: "rgba",
                          lighten: 8,
                      }),
            },
            text: {
                color: formatColor(resolvedColor, {
                    format: "rgba",
                    lighten: 80,
                }),
            },
        },
        plain: {
            container: {
                backgroundColor: isSelected
                    ? formatColor(resolvedColor, {
                          alpha: 70,
                          format: "rgba",
                          lighten: 15,
                      })
                    : "transparent",
                borderTopWidth: 0,
            },
            text: {
                color: formatColor(resolvedColor, {
                    format: "rgba",
                    lighten: 80,
                }),
            },
        },
    };
};
