import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ViewProps } from "react-native";

export interface CircularProgressProps extends ViewProps {
    size?: Size | SizeValue | number;
    color?: Color | ColorLike;
    variant?: Variant;

    determinate?: boolean;
    value?: number;

    strokeWidth?: Size | SizeValue | number;
}
