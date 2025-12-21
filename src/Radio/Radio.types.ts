import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";

export interface RadioProps extends Omit<PressableProps, "onPress"> {
    checked?: boolean;
    defaultChecked?: boolean;

    onChange?: (checked: boolean) => void;

    label?: ReactNode;
    disabled?: boolean;

    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    uncheckedIcon?: ReactNode;
    checkedIcon?: ReactNode;

    rtl?: boolean;

    name?: string;
    value?: any;
}
