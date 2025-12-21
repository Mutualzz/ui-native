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

export interface TextareaProps extends Omit<
    TextInputProps,
    "multiline" | "editable"
> {
    color?: Color | ColorLike;
    textColor?: TypographyColor | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    disabled?: boolean;

    resizable?: boolean;
    minRows?: number;
    maxRows?: number;

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;

    error?: boolean;
}
