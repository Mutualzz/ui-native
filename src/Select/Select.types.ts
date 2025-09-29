import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";

export interface SelectProps<T = string | number>
    extends Omit<ViewProps, "onLayout"> {
    size?: Size | SizeValue | number;
    variant?: Variant;
    color?: Color | ColorLike;

    startDecorator?: ReactNode;
    endDecorator?: ReactNode;

    placeholder?: string;

    multiple?: boolean;
    disabled?: boolean;
    required?: boolean;
    autoFocus?: boolean;

    value?: T | T[];
    defaultValue?: T | T[];
    onValueChange?: (value: T | T[]) => void;

    closeOnClickOutside?: boolean;
}
