import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { PressableProps } from "react-native";

export interface ListItemButtonProps extends PressableProps {
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;

    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;
}
