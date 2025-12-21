import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";

export interface SelectProps<T = string | number> extends Omit<
    PressableProps,
    "onPress"
> {
    size?: Size | SizeValue | number;
    variant?: Variant;
    color?: Color | ColorLike;

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;

    placeholder?: string;

    multiple?: boolean;
    disabled?: boolean;

    value?: T | T[];
    defaultValue?: T | T[];

    onValueChange?: (value: T | T[]) => void;

    closeOnClickOutside?: boolean;

    children?: ReactNode;
}
