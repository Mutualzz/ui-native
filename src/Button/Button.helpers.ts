import type { Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import {
    createColor,
    formatColor,
    resolveColor,
    resolveSize,
} from "@mutualzz/ui-core";
import type { TextStyle, ViewStyle } from "react-native";

const baseSizeMap: Record<Size, number> = {
    sm: 14,
    md: 16,
    lg: 18,
};

export const resolveButtonContainerSize = (
    theme: Theme,
    size: Size | SizeValue | number,
    padding?: number,
) => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    const pad = padding ?? resolvedSize * 0.6;

    return {
        fontSize: resolvedSize,
        padding: pad,
        gap: resolvedSize * 0.5,
    };
};

interface ButtonContainerState {
    disabled?: boolean;
    selected?: boolean;
    pressed?: boolean;
}

export const resolveButtonContainerStyles = (
    theme: Theme,
    color: Color | ColorLike,
    state: ButtonContainerState,
): Record<Variant, ViewStyle> => {
    const { disabled, selected, pressed } = state;

    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor);

    const disabledSolidBg = formatColor(resolvedColor, {
        alpha: 50,
        format: "hexa",
    });

    const disabledBgSoft = formatColor(resolvedColor, {
        alpha: 5,
        format: "hexa",
    });

    const disabledBorder = formatColor(resolvedColor, {
        alpha: 30,
        format: "hexa",
    });

    return {
        solid: {
            backgroundColor: disabled
                ? disabledSolidBg
                : selected || pressed
                  ? formatColor(resolvedColor, { alpha: 70, format: "hexa" })
                  : hexColor,
            borderWidth: 0,
        },

        outlined: {
            backgroundColor: selected
                ? formatColor(resolvedColor, { alpha: 30, format: "hexa" })
                : pressed
                  ? formatColor(resolvedColor, { alpha: 30, format: "hexa" })
                  : "transparent",
            borderWidth: 1,
            borderColor: disabled ? disabledBorder : formatColor(resolvedColor),
        },

        plain: {
            backgroundColor: selected
                ? formatColor(resolvedColor, { alpha: 30, format: "hexa" })
                : pressed
                  ? formatColor(resolvedColor, { alpha: 30, format: "hexa" })
                  : "transparent",
            borderWidth: 0,
        },

        soft: {
            backgroundColor: disabled
                ? disabledBgSoft
                : selected || pressed
                  ? formatColor(resolvedColor, { alpha: 40, format: "hexa" })
                  : formatColor(resolvedColor, { alpha: 15, format: "hexa" }),
            borderWidth: 0,
        },
    };
};

export const resolveButtonTextStyles = (
    theme: Theme,
    color: Color | ColorLike,
    // Disabled state is communicated via the container's background alpha
    // (see resolveButtonContainerStyles) — text stays fully opaque so it
    // doesn't compound into unreadably low contrast, matching ui-web.
    _state?: { disabled?: boolean },
): Record<Variant, TextStyle> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        solid: { color: solidTextColor },
        outlined: { color: hexColor },
        plain: { color: hexColor },
        soft: { color: hexColor },
    };
};
