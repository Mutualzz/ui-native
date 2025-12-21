import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { PressableProps, ViewStyle } from "react-native";

export interface OptionProps extends Omit<
    PressableProps,
    "style" | "children" | "onPress"
> {
    value: any;

    label?: ReactNode;
    children?: ReactNode;

    disabled?: boolean;

    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    style?: ViewStyle;
}
