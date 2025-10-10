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

export const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 48,
};

export const resolveSelectSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    return {
        container: {
            minHeight: resolvedSize,
            paddingHorizontal: resolvedSize * 0.25,
            paddingVertical: resolvedSize * 0.12,
            borderRadius: 6,
        },
        text: {
            fontSize: resolvedSize * 0.32,
        },
        popup: {
            minWidth: resolvedSize * 3,
            gap: resolvedSize * 0.15,
        },
    };
};

export const resolveSelectStyles = (theme: Theme, color: Color | ColorLike) => {
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            container: {
                backgroundColor: formatColor(resolvedColor, { format: "rgba" }),
            },
            text: {
                color: formatColor(theme.typography.colors.primary, {
                    format: "rgba",
                }),
            },
        },
        outlined: {
            container: {
                borderWidth: 1,
                borderColor: formatColor(resolvedColor, { format: "rgba" }),
                backgroundColor: "transparent",
            },
            text: {
                color: formatColor(resolvedColor, {
                    format: "rgba",
                    lighten: 75,
                }),
            },
        },
        soft: {
            container: {
                backgroundColor: formatColor(resolvedColor, {
                    darken: 15,
                    format: "rgba",
                }),
            },
            text: {
                color: formatColor(resolvedColor, {
                    lighten: 75,
                    format: "rgba",
                }),
            },
        },
        plain: {
            container: { backgroundColor: "transparent" },
            text: {
                color: formatColor(resolvedColor, {
                    lighten: 75,
                    format: "rgba",
                }),
            },
        },
    };
};

export const resolveSelectContentStyles = (
    theme: Theme,
    color: Color | ColorLike,
) => {
    const { colors } = theme;
    const resolvedColor = resolveColor(color, theme);

    return {
        solid: {
            surface: {
                backgroundColor: formatColor(resolvedColor, { format: "rgba" }),
            },
            item: {
                color: formatColor(theme.typography.colors.primary, {
                    format: "rgba",
                }),
            },
        },
        outlined: {
            surface: {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: formatColor(resolvedColor, { format: "rgba" }),
            },
            item: {
                color: formatColor(resolvedColor, {
                    format: "rgba",
                    lighten: 20,
                }),
            },
        },
        soft: {
            surface: {
                backgroundColor: formatColor(resolvedColor, {
                    format: "rgba",
                    darken: 50,
                }),
            },
            itemTeitemxt: {
                color: formatColor(resolvedColor, {
                    format: "rgba",
                    lighten: 20,
                }),
            },
        },
        plain: {
            surface: { backgroundColor: colors.surface },
            item: { color: formatColor(resolvedColor, { format: "rgba" }) },
        },
    };
};
