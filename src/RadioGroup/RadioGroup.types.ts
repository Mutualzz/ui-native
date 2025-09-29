import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";

export interface RadioGroupProps {
    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    /**
     * The name of the radio group.
     * This is used to group radio buttons together so that only one can be selected at a time.
     * It is also used to identify the group in form submissions.
     */
    name?: string;
    /**
     * The value of the currently selected radio button.
     */
    value?: string;
    /**
     * The default value of the radio group when it is first rendered.
     */
    defaultValue?: string;
    /**
     * Callback function called when the selected radio button changes.
     * It receives the change event and the new value as arguments.
     */
    onChange?: (value: string) => void;
    /**
     * Whether the radio group is disabled.
     * When true, all radio buttons in the group will be unclickable and visually styled as disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the radio buttons should be displayed in a row.
     * When true, the radio buttons will be arranged horizontally.
     * @default false
     */
    orientation?: Orientation;

    spacing?: Size | SizeValue | number;

    /**
     * The children of the radio group.
     * This should be a collection of `Radio` components that will be rendered as part of the group.
     * Each `Radio` component should have a unique `value` prop.
     */
    children: ReactNode;
}
