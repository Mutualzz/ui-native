import type {
    Color,
    ColorLike,
    Orientation,
    Shape,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { PropsWithChildren } from "react";
import type { ViewProps } from "react-native";
import type {
    HorizontalButtonAlign,
    VerticalButtonAlign,
} from "../Button/Button.types";

export interface ButtonGroupProps
    extends PropsWithChildren, Omit<ViewProps, "children"> {
    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    verticalAlign?: VerticalButtonAlign;
    horizontalAlign?: HorizontalButtonAlign;

    fullWidth?: boolean;
    expand?: boolean;
    disabled?: boolean;

    orientation?: Orientation;

    loading?: boolean;

    separatorColor?: Color | ColorLike;

    spacing?: Size | SizeValue | number;

    toggleable?: boolean;
    value?: any | any[];
    onChange?: (value: any | any[]) => void;
    exclusive?: boolean;

    shape?: Shape | SizeValue | number;
    textColor?: Color | ColorLike;
}
