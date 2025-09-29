import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";

export interface OptionProps extends Omit<PressableProps, "color"> {
    value: string | number;

    disabled?: boolean;
    selected?: boolean;
    children?: ReactNode;

    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    label?: string;
}
