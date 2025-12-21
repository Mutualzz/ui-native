import type {
    Color,
    ColorLike,
    TypographyColor,
    TypographyLevel,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { TextProps, TextStyle } from "react-native";

export type LinkUnderline = "none" | "hover" | "always";
export type LinkVariant = Variant | "none";

export interface LinkProps extends TextProps {
    level?: TypographyLevel;
    color?: Color | ColorLike;
    textColor?: TypographyColor | ColorLike;

    variant?: LinkVariant;
    underline?: LinkUnderline;

    weight?: TextStyle["fontWeight"];

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
}
