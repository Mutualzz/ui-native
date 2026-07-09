import type {
    Color,
    ColorLike,
    TypographyColor,
    TypographyLevel,
    Variant,
} from "@mutualzz/ui-core";
import type { TextProps, TextStyle } from "react-native";

import type { TypographyTruncate } from "../utils/accessibility";

export type TypographyVariant = Variant | "none";

export interface TypographyProps extends TextProps {
    level?: TypographyLevel;
    color?: Color | ColorLike;
    textColor?: TypographyColor | ColorLike;
    variant?: TypographyVariant;
    weight?: TextStyle["fontWeight"];
    /**
     * Controls line clamping. At large system text sizes, text is allowed to
     * wrap instead of ellipsizing early.
     */
    truncate?: TypographyTruncate;
}
