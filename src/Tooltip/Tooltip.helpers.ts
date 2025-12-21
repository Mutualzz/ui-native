import type { Theme } from "@emotion/react";
import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import {
    createColor,
    dynamicElevation,
    formatColor,
    resolveColor,
    resolveSize,
} from "@mutualzz/ui-core";
import type { TextStyle, ViewStyle } from "react-native";
import type { Rect, TooltipPlacement, TooltipVariant } from "./Tooltip.types";

const baseSizeMap: Record<Size, number> = { sm: 14, md: 16, lg: 20 };

export const resolveTooltipContainerSize = (
    theme: Theme,
    size: Size | SizeValue | number,
) => {
    const sizeVal = resolveSize(theme, size, baseSizeMap);

    return {
        fontSize: sizeVal,
        paddingVertical: Math.round(sizeVal * 0.5),
        paddingHorizontal: Math.round(sizeVal * 0.66),
        borderRadius: Math.max(6, Math.round(sizeVal * 0.66)),
        gap: Math.max(6, Math.round(sizeVal * 0.66)),
        arrow: Math.max(6, Math.round(sizeVal * 0.58)),
    };
};

export const resolveTooltipContainerStyles = (
    theme: Theme,
    color: Color | ColorLike,
    elevation: number,
): Record<TooltipVariant, ViewStyle> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        none: {
            backgroundColor: dynamicElevation(theme.colors.surface, elevation),
        },
        solid: {
            backgroundColor: hexColor,
        },
        outlined: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 20,
            }),
            borderWidth: 1,
            borderColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 70,
            }),
        },
        plain: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 85,
            }),
            borderWidth: 1,
            borderColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 10,
            }),
        },
        soft: {
            backgroundColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 18,
            }),
            borderWidth: 1,
            borderColor: formatColor(resolvedColor, {
                format: "hexa",
                alpha: 10,
            }),
        },
    };
};

export const resolveTooltipTextStyles = (
    theme: Theme,
    color: Color | ColorLike,
): Record<TooltipVariant, TextStyle> => {
    const resolvedColor = resolveColor(color, theme);
    const hexColor = formatColor(resolvedColor, { format: "hexa" });

    const solidTextColor = formatColor(theme.typography.colors.primary, {
        format: "hexa",
        negate: createColor(resolvedColor).isLight(),
    });

    return {
        none: { color: theme.typography.colors.primary },
        solid: { color: solidTextColor },
        outlined: { color: hexColor },
        plain: { color: hexColor },
        soft: { color: hexColor },
    };
};

export const computePosition = (args: {
    placement: TooltipPlacement;
    anchor: Rect;
    tip: { width: number; height: number };
    screen: { width: number; height: number };
    offset: number;
}) => {
    const { placement, anchor, tip, screen, offset } = args;

    const axCenter = anchor.x + anchor.width / 2;
    const ayCenter = anchor.y + anchor.height / 2;

    const [side, align] = placement.split("-") as [string, string | undefined];

    let left = axCenter - tip.width / 2;
    let top = ayCenter - tip.height / 2;

    if (side === "top") top = anchor.y - tip.height - offset;
    if (side === "bottom") top = anchor.y + anchor.height + offset;
    if (side === "left") left = anchor.x - tip.width - offset;
    if (side === "right") left = anchor.x + anchor.width + offset;

    if (side === "top" || side === "bottom") {
        if (align === "start") left = anchor.x;
        if (align === "end") left = anchor.x + anchor.width - tip.width;
    } else {
        if (align === "start") top = anchor.y;
        if (align === "end") top = anchor.y + anchor.height - tip.height;
    }

    const margin = 6;
    left = Math.max(margin, Math.min(left, screen.width - tip.width - margin));
    top = Math.max(margin, Math.min(top, screen.height - tip.height - margin));

    return { left, top };
};
