import {
    type Color,
    type ColorLike,
    type Size,
    type SizeValue,
    type Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";

export interface CheckboxProps extends ViewProps {
    /**
     * The label for the checkbox.
     * It can be a string or a ReactNode.
     */
    label?: ReactNode;
    /**
     * The controlled checked state of the checkbox.
     */
    checked?: boolean;
    /**
     * The default checked state of the checkbox.
     * This is used when the checkbox is uncontrolled.
     * If `checked` is provided, this will be ignored.
     */
    defaultChecked?: boolean;
    /**
     * Disables the checkbox.
     * When true, the checkbox cannot be interacted with.
     */
    disabled?: boolean;

    /**
     * Indicates whether the checkbox is in an indeterminate state.
     * This is typically used for checkboxes that represent a group of items
     * where some, but not all, items are checked.
     */
    indeterminate?: boolean;

    /**
     * The icon to display when the checkbox is checked.
     * If not provided, a default check icon will be used.
     */
    checkedIcon?: ReactNode;
    /**
     * The icon to display when the checkbox is unchecked.
     * If not provided, a default unchecked icon will be used.
     */
    uncheckedIcon?: ReactNode;
    /**
     * The icon to display when the checkbox is in an indeterminate state.
     * If not provided, a default indeterminate icon will be used.
     */
    indeterminateIcon?: ReactNode;

    /**
     * The color of the checkbox, which can be a predefined color or a custom color
     *
     * @default "neutral"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Color | ColorLike;
    /**
     * The variant of the checkbox, which determines its style.
     *
     * @default "solid"
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Variant;
    /**
     * The size of the checkbox, which can be a predefined size or a custom size in pixels.
     *
     * @default "md"
     * @example "sm", "md", "lg", 20
     */
    size?: Size | SizeValue | number;

    /**
     * This is the direction of the checkbox label.
     * If true, the label will be displayed on the left side of the checkbox.
     * If false, the label will be displayed on the right side of the checkbox.
     */
    rtl?: boolean;

    /**
     * Callback function called when the checkbox state changes.
     */
    onChange?: (checked: boolean) => void;

    value?: any;
}
