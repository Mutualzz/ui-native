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
    children?: ReactNode;

    color?: Color | ColorLike;
    textColor?: TypographyColor | ColorLike;

    size?: Size | SizeValue | number;
    variant?: Variant;

    error?: boolean;
    readOnly?: boolean;

    fullWidth?: boolean;
    disabled?: boolean;

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
}
