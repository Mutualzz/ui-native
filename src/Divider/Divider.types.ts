import {
    type Color,
    type ColorLike,
    type TypographyColor,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerInset = "none" | "start" | "end";

export type DividerVariant = "solid" | "dashed" | "dotted" | "double";

export interface DividerProps extends ViewProps {
    /**
     * The orientation of the divider.
     *
     * @default "horizontal"
     * @example "horizontal", "vertical"
     */
    orientation?: DividerOrientation;
    /**
     * The inset of the divider.
     * Determines how the divider is positioned relative to its container.
     *
     * @default "none"
     * @example "none", "start", "end"
     */
    inset?: DividerInset;

    /**
     * The color of the divider line.
     * Can be a predefined color or a custom color.
     *
     * @default "neutral"
     * @example "primary", "neutral", "secondary", "accent", "disabled", "success", "info", "warning", "danger", "#ff5733"
     */
    lineColor?: Color | ColorLike | TypographyColor;
    /**
     * The color of the divider text.
     * Can be a predefined color or a custom color.
     *
     * @default "neutral"
     * @example "primary", "neutral", "secondary", "accent", "disabled", "success", "info", "warning", "danger", "#ff5733"
     */
    textColor?: Color | ColorLike | TypographyColor;
    /**
     * The variant of the divider.
     * Determines the style of the divider line.
     *
     * @default "solid"
     * @example "solid", "dashed", "dotted", "double"
     */
    variant?: DividerVariant;

    /**
     * Optional children to render inside the divider.
     * This can be used to display text or other content in the divider.
     */
    children?: ReactNode;
}
