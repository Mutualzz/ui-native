import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ViewProps } from "react-native";

export type LinearProgressAnimation =
    | "slide"
    | "wave"
    | "bounce"
    | "scale-in-out";

export interface LinearProgressProps extends ViewProps {
    length?: Size | SizeValue | number;
    thickness?: Size | SizeValue | number;

    variant?: Variant;
    color?: Color | ColorLike;

    animation?: LinearProgressAnimation;

    determinate?: boolean;
    value?: number;
}
