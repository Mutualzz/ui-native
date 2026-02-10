import type { Theme } from "@emotion/react";
import {
    type Color,
    type ColorLike,
    createColor,
    dynamicElevation,
    formatColor,
    resolveColor,
    resolveSize,
    type Size,
    type SizeValue,
} from "@mutualzz/ui-core";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import type { PaperVariant } from "../Paper/Paper.types";
import type { AvatarShape } from "./Avatar.types";

const baseSizeMap: Record<Size, number> = {
    sm: 32,
    md: 40,
    lg: 56,
};

export const resolveAvatarSize = (
    theme: Theme,
    size: Size | SizeValue | number,
    hasText: boolean,
): { container: ViewStyle; text?: TextStyle } => {
    const resolvedSize = resolveSize(theme, size, baseSizeMap);

    const container: ViewStyle = {
        width: resolvedSize,
        height: resolvedSize,
    };

    if (!hasText) return { container };

    return {
        container: {
            ...container,
            padding: resolvedSize / 6,
        },
        text: {
            fontSize: resolvedSize / 2.2,
        },
    };
};

export const resolveAvatarShape = (
    radius: AvatarShape | SizeValue | number,
): ImageStyle => {
    let resolvedRadius: ImageStyle["borderRadius"];

    switch (radius) {
        case "circle":
            resolvedRadius = 9999;
            break;
        case "rounded":
            resolvedRadius = 12;
            break;
        case "square":
            resolvedRadius = 0;
            break;
        default:
            resolvedRadius = radius;
            break;
    }

    return { borderRadius: resolvedRadius };
};

const elevationShadow = (elevation: number): ViewStyle => {
    const y = 1 + elevation;
    const blur = 4 + elevation * 2;
    const opacity = Math.min(0.35, 0.1 + elevation * 0.05);

    return {
        elevation,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: y },
        shadowOpacity: opacity,
        shadowRadius: blur,
    };
};

export const resolveAvatarStyles = (
    theme: Theme,
    color: Color | ColorLike,
    hasText: boolean,
    elevation: number,
): {
    container: Partial<Record<PaperVariant, ViewStyle>>;
    text: Partial<Record<PaperVariant, TextStyle>>;
} => {
    const { colors } = theme;

    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor);

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        negate: createColor(resolvedColor).isLight(),
    });

    const container: Partial<Record<PaperVariant, ViewStyle>> = {};
    const text: Partial<Record<PaperVariant, TextStyle>> = {};

    if (hasText) {
        container.solid = {
            backgroundColor: hexColor,
        };
        text.solid = { color: solidTextColor };

        container.plain = {
            backgroundColor: "transparent",
        };
        text.plain = { color: formatColor(resolvedColor) };

        container.soft = {
            backgroundColor: formatColor(resolvedColor, {
                alpha: 15,
                format: "hexa",
            }),
        };
        text.soft = { color: formatColor(resolvedColor) };
    }

    container.elevation = {
        backgroundColor: dynamicElevation(colors.surface, elevation),
        ...elevationShadow(elevation),
    };

    container.outlined = {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: formatColor(resolvedColor),
    };
    text.outlined = { color: formatColor(resolvedColor) };

    return { container, text };
};
