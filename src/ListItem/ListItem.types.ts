import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import type { ListOrientation } from "../List/List.context";

export interface ListItemProps extends ViewProps {
    startDecorator?: ReactNode;
    endDecorator?: ReactNode;

    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    orientation?: ListOrientation;

    marker?: string;
}
