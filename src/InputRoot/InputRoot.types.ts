import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    TypographyColor,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { TextInputProps } from "react-native";

export interface InputRootProps extends TextInputProps {
    /**
     * The color of the input element.
     * Can be a predefined color or a custom color.
     *
     * @default "neutral"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Color | ColorLike;
    /**
     * The text color of the input element.
     * If set to "inherit", the input will inherit the text color from its parent.
     *
     * @default "inherit"
     * @example "primary", "secondary", "accent", "disabled", "inherit"
     */
    textColor?: TypographyColor | ColorLike | "inherit";
    /**
     * The variant of the input element.
     * Determines the style of the input element.
     *
     * @default "outlined"
     * @example "outlined", "solid", "plain", "soft"
     */
    variant?: Variant;
    /**
     * The size of the input element.
     * Can be a predefined size ("sm", "md", "lg") or a custom size in pixels.
     * If a number is provided, it will be used as the font size.
     *
     * @default "md"
     * @min 6
     * @max 32
     * @example "sm", "md", "lg", 16
     */
    size?: Size | SizeValue | number;

    /**
     * Optional start decorator to render before the input element.
     * This can be used to display icons or additional content.
     */
    startDecorator?: ReactNode;
    /**
     * Optional end decorator to render after the input element.
     * This can be used to display icons or additional content.
     */
    endDecorator?: ReactNode;

    /**
     * If true, the input will take the full width of its container.
     * @default false
     */
    fullWidth?: boolean;
    /**
     * If true, the input will be displayed in an error state.
     * This can be used to indicate validation errors or issues with the input.
     * @default false
     */
    error?: boolean;

    disabled?: boolean;
}
