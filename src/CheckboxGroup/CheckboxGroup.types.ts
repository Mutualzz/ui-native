import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { PropsWithChildren } from "react";
import type { ViewProps } from "react-native";

export interface CheckboxGroupProps
    extends PropsWithChildren, Omit<ViewProps, "children"> {
    name?: string;

    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    orientation?: Orientation;

    value?: string[];
    defaultValue?: string[];

    onChange?: (value: string[]) => void;

    disabled?: boolean;

    spacing?: Size | SizeValue | number;
}
