import {
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import { type ReactNode } from "react";
import type { ViewStyle } from "react-native";

export interface RadioProps extends ViewStyle {
    /**
     * Whether the radio is checked. If not provided, it will be controlled internally.
     *
     * @default false
     */
    checked?: boolean;

    /**
     * The default checked state of the radio button when it is first rendered.
     * This is used when the radio button is uncontrolled.
     * If `checked` is provided, this will be ignored.
     */
    defaultChecked?: boolean;

    /**
     * Callback function called when the radio is checked or unchecked.
     * It receives the change event as an argument.
     */
    onChange?: (value: string) => void;
    /**
     * The label to display next to the radio button.
     * This can be a string or any valid React node.
     */
    label?: ReactNode;
    /**
     * Whether the radio button is disabled.
     * When true, the radio button will be unclickable and visually styled as disabled.
     * @default false
     */
    disabled?: boolean;

    /**
     * The color of the radio button.
     * This can be a predefined color name or a custom color value
     *
     * @default "primary"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Color | ColorLike;
    /**
     * The variant of the radio button.
     * This defines the visual style of the radio button.
     *
     * @default "solid"
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Variant;
    /**
     * The size of the radio button.
     * This can be a predefined size or a custom size value.
     *
     * @default "md"
     * @min 10
     * @max 28
     * @example "sm", "md", "lg", 20
     */
    size?: Size | SizeValue | number;

    /**
     * Unchecked icon to display when the radio is not checked.
     * This can be any valid React node, such as an SVG icon or an image.
     * If not provided, a default icon will be used.
     */
    uncheckedIcon?: ReactNode;
    /**
     * Checked icon to display when the radio is checked.
     * This can be any valid React node, such as an SVG icon or an image.
     * If not provided, a default icon will be used.
     */
    checkedIcon?: ReactNode;

    /**
     * Whether the radio button label should be displayed in a right-to-left layout.
     * @default false
     */
    rtl?: boolean;

    value?: string;
}
