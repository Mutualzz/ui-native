import type {
    Color,
    ColorLike,
    TypographyColor,
    TypographyLevel,
    Variant,
} from "@mutualzz/ui-core";
import type { TextProps, TextStyle } from "react-native";

export type TypographyVariant = Variant | "none";

export interface TypographyProps extends TextProps {
    /**
     * Typography Level.
     * This can be a predefined level like "h1", "h2", and etc.
     *
     * @default "inherit"
     * @example "h1", "h2", "h3", "inherit"
     */
    level?: TypographyLevel | "inherit";

    /**
     * Font weight.
     * This can be a predefined weight like "light", "normal", "medium", "bold", or a custom number.
     * It determines the thickness of the text.
     *
     * @default "normal"
     * @example "light", "normal", "medium", "bold", 400
     */
    weight?: TextStyle["fontWeight"];

    /**
     * Color or color-like value for the typography.
     * This can be a color name, hex code, or any valid color format, doesn't apply on "none" variant.
     *
     * @default "neutral"
     * @example "primary", "neutral", "success", "info", "warning", "danger", "#ff5733"
     */
    color?: Color | ColorLike;
    textColor?: TypographyColor | ColorLike | "inherit";

    /**
     * Variant of the typography.
     * This can be "solid", "outlined", "soft", "plain", or "none".
     * It determines the visual style of the typography.
     * "none" variant will not apply any styles.
     * It is useful for cases where you want to use the typography component without any additional styles.
     *
     * @default "none"
     * @example "solid", "outlined", "soft", "plain", "none"
     */
    variant?: TypographyVariant;
}
