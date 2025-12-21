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
    level?: TypographyLevel;
    color?: Color | ColorLike;
    textColor?: TypographyColor | ColorLike;
    variant?: TypographyVariant;
    weight?: TextStyle["fontWeight"];
}
