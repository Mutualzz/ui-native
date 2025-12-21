import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";

export interface CheckboxProps extends Omit<PressableProps, "children"> {
    label?: ReactNode;

    checked?: boolean;
    defaultChecked?: boolean;

    disabled?: boolean;

    indeterminate?: boolean;

    checkedIcon?: ReactNode;
    uncheckedIcon?: ReactNode;
    indeterminateIcon?: ReactNode;

    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    rtl?: boolean;

    value?: any;
    name?: string;

    onChange?: (checked: boolean) => void;
}
