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

export type InputNumberMode = "decimal" | "numeric";

export interface InputNumberProps extends Omit<
    TextInputProps,
    "onChange" | "onChangeText" | "value" | "defaultValue"
> {
    color?: Color | ColorLike;
    textColor?: TypographyColor | ColorLike;

    variant?: Variant;
    size?: Size | SizeValue | number;

    fullWidth?: boolean;
    error?: boolean;
    disabled?: boolean;

    inputMode?: InputNumberMode;

    step?: number;
    min?: number;
    max?: number;

    value?: string;
    defaultValue?: string;

    onChange?: (value: string) => void;

    onIncrement?: () => void;
    onDecrement?: () => void;

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;
}
