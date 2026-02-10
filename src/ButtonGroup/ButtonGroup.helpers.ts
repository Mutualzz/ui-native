import type { Theme } from "@emotion/react";
import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    Variant,
} from "@mutualzz/ui-core";
import { formatColor, resolveColor } from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

export const baseSpacingMap: Record<Size, number> = {
    sm: 8,
    md: 12,
    lg: 16,
};

type Position = "first" | "middle" | "last";

export const resolveButtonGroupItemStyles = (
    theme: Theme,
    orientation: Orientation,
    color: Color | ColorLike = "primary",
    variant: Variant = "solid",
    separatorColor?: Color | ColorLike,
    position: Position = "middle",
): ViewStyle => {
    const resolvedColor = separatorColor
        ? resolveColor(separatorColor, theme)
        : resolveColor(color, theme);

    const solidBorder = separatorColor
        ? formatColor(resolvedColor)
        : formatColor(resolvedColor, { darken: 50 });

    const plainBorder = separatorColor
        ? formatColor(resolvedColor)
        : formatColor(resolvedColor, { darken: 30 });

    const softBorder = separatorColor
        ? formatColor(resolvedColor)
        : formatColor(resolvedColor, { darken: 10 });

    const borderColorByVariant: Record<Variant, string | undefined> = {
        solid: solidBorder,
        outlined: undefined,
        plain: plainBorder,
        soft: softBorder,
    };

    const separatorColorResolved = borderColorByVariant[variant];

    const style: ViewStyle = {};

    if (orientation === "horizontal") {
        if (position === "first") {
            style.borderTopRightRadius = 0;
            style.borderBottomRightRadius = 0;
        } else if (position === "middle") {
            style.borderTopLeftRadius = 0;
            style.borderTopRightRadius = 0;
            style.borderBottomLeftRadius = 0;
            style.borderBottomRightRadius = 0;
        } else {
            style.borderTopLeftRadius = 0;
            style.borderBottomLeftRadius = 0;
        }

        if (position !== "first" && separatorColorResolved) {
            style.borderLeftWidth = 1;
            style.borderLeftColor = separatorColorResolved;
        }
    } else {
        if (position === "first") {
            style.borderBottomLeftRadius = 0;
            style.borderBottomRightRadius = 0;
        } else if (position === "middle") {
            style.borderTopLeftRadius = 0;
            style.borderTopRightRadius = 0;
            style.borderBottomLeftRadius = 0;
            style.borderBottomRightRadius = 0;
        } else {
            style.borderTopLeftRadius = 0;
            style.borderTopRightRadius = 0;
        }

        if (position !== "first" && separatorColorResolved) {
            style.borderTopWidth = 1;
            style.borderTopColor = separatorColorResolved;
        }
    }

    return style;
};
