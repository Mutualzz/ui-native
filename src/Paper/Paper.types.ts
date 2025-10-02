import { type Color, type ColorLike, type Variant } from "@mutualzz/ui-core";
import type { ViewStyle } from "react-native";

export type PaperVariant = Variant | "elevation";

export interface PaperProps extends ViewStyle {
    /**
     * The color of the Paper component.
     * Can be a color name or a color value.
     * @default "neutral"
     */
    color?: Color | ColorLike;

    /**
     * The variant of the Paper component.
     * Can be "elevation", "solid", "outlined", "plain", or "soft".
     * @default "elevation"
     */
    variant?: PaperVariant;

    /**
     * Elevation level for the Paper component.
     * This is only applicable for the "elevation" variant.
     * It determines the shadow and background color.
     * @default 0
     */
    elevation?: number;

    /**
     * If true, the Paper will not have a translucent background.
     * Only applicable when a gradient theme is preset
     * @default false
     */
    nonTranslucent?: boolean;
}
