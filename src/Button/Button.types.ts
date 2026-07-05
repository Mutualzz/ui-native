import {
    type Color,
    type ColorLike,
    type Orientation,
    type Shape,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import { type ReactNode } from "react";
import type { PressableProps } from "react-native";

export type VerticalButtonAlign = "top" | "center" | "bottom";
export type HorizontalButtonAlign = "left" | "center" | "right";

export interface ButtonProps extends Omit<
    PressableProps,
    "children" | "disabled"
> {
    /**
     * The variant of the button, which determines its style.
     * @default "solid"
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Variant;
    /**
     * The color of the button, which can be a predefined color or a custom color.
     * @default "primary"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Color | ColorLike;
    /**
     * The size of the button, which can be a predefined size or a custom size in pixels.
     * @default "md"
     * @example "sm", "md", "lg", 20
     */
    size?: Size | SizeValue | number;

    verticalAlign?: VerticalButtonAlign;
    horizontalAlign?: HorizontalButtonAlign;
    orientation?: Orientation;

    fullWidth?: boolean;

    /**
     * Grows to share available space equally with sibling flex items
     * (e.g. two buttons side by side in a row, each taking half). Unlike
     * `fullWidth` (which sets an absolute 100% width regardless of
     * siblings), `expand` only affects how this button competes for space
     * within its own flex parent.
     * @default false
     */
    expand?: boolean;

    disabled?: boolean;

    /**
     * Indicates whether the button is in a loading state.
     * If true, the button will show a loading indicator and be disabled.
     * @default false
     */
    loading?: boolean;
    /**
     * Custom loading indicator to display when the button is in a loading state.
     * If not provided, a default loading spinner will be shown.
     */
    loadingIndicator?: ReactNode;

    /**
     * Content to display at the start of the button (e.g., an icon).
     */
    startDecorator?: ReactNode;
    /**
     * Content to display at the end of the button (e.g., an icon).
     */
    endDecorator?: ReactNode;

    /**
     * Content to display inside the button.
     */
    children?: ReactNode;

    /**
     * Padding override
     */
    padding?: number;

    selected?: boolean;

    /**
     * The corner shape of the button.
     * @default "rounded"
     * @example "rounded", "square", "circle", 20
     */
    shape?: Shape | SizeValue | number;

    /**
     * Overrides the button's text color independent of `color` (which still
     * governs the background/border). If not provided, the text color is
     * derived from `color` as usual.
     */
    textColor?: Color | ColorLike;

    /**
     * Optional value used by ButtonGroup selection logic
     */
    value?: any;
}
