import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";

export interface CheckboxGroupProps {
    /**
     * The color of the button group, which can be a predefined color or a custom color.
     * If not provided, the buttons will use their assigned colors.
     *
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Color | ColorLike;
    /**
     * The variant of the button group, which determines the style of the buttons.
     * If not provided, the buttons will use their assigned variants.
     *
     * @example "solid", "outlined", "soft", "plain"
     */
    variant?: Variant;
    /**
     * The size of the buttons in the group, which can be a predefined size or a custom size in pixels.
     * If not provided, the buttons will use their assigned sizes.
     *
     * @example "sm", "md", "lg", 20
     */
    size?: Size | SizeValue | number;

    /**
     * The name of the checkbox group.
     * This is used to group checkboxes together.
     */
    name?: string;
    /**
     * The controlled value of the checkbox group.
     * This is an array of strings representing the values of the checked checkboxes.
     */
    value?: string[];
    /**
     * The default value of the checkbox group.
     * This is used when the checkbox group is uncontrolled.
     * If `value` is provided, this will be ignored.
     */
    defaultValue?: string[];
    /**
     * The function to call when the value of the checkbox group changes.
     * It receives the event and the new value as arguments.
     */
    onChange?: (value: string[]) => void;
    /**
     * Disables all checkboxes in the group.
     * When true, the checkboxes cannot be interacted with.
     */
    disabled?: boolean;
    /**
     * Applies the orientation
     * @default "horizontal"
     */
    orientation?: Orientation;

    spacing?: Size | SizeValue | number;

    /**
     * Checkbox items to render in the group.
     */
    children: ReactNode;
}
