import type { Theme } from "@emotion/react";
import {
    formatColor,
    resolveColor,
    resolveColorFromLuminance,
    resolveSize,
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";
import ColorPkg from "color";

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
    const textColor = resolveColorFromLuminance(ColorPkg(resolvedColor), theme);

    return {
        solid: {
            container: {
                backgroundColor: formatColor(resolvedColor, { format: "hexa" }),
            },
            text: {
                color: formatColor(textColor, { format: "hexa" }),
            },
        },
        outlined: {
            container: {
                borderWidth: 1,
                borderColor: formatColor(resolvedColor, { format: "hexa" }),
                backgroundColor: "transparent",
            },
            text: {
                color: formatColor(resolvedColor, {
                    format: "hexa",
                    lighten: 75,
                }),
            },
        },
        soft: {
            container: {
                backgroundColor: formatColor(resolvedColor, {
                    darken: 15,
                    format: "hexa",
                }),
            },
            text: {
                color: formatColor(resolvedColor, {
                    lighten: 75,
                    format: "hexa",
                }),
            },
        },
        plain: {
            container: { backgroundColor: "transparent" },
            text: {
                color: formatColor(resolvedColor, {
                    lighten: 75,
                    format: "hexa",
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
    const textColor = resolveColorFromLuminance(ColorPkg(resolvedColor), theme);

    return {
        solid: {
            surface: {
                backgroundColor: formatColor(resolvedColor, { format: "hexa" }),
            },
            item: {
                color: formatColor(textColor, { format: "hexa" }),
            },
        },
        outlined: {
            surface: {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: formatColor(resolvedColor, { format: "hexa" }),
            },
            item: {
                color: formatColor(resolvedColor, {
                    format: "hexa",
                    lighten: 20,
                }),
            },
        },
        soft: {
            surface: {
                backgroundColor: formatColor(resolvedColor, {
                    darken: 50,
                }),
            },
            itemTeitemxt: {
                color: formatColor(resolvedColor, {
                    lighten: 20,
                }),
            },
        },
        plain: {
            surface: { backgroundColor: colors.surface },
            item: { color: formatColor(resolvedColor, { format: "hexa" }) },
        },
    };
};
