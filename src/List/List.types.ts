import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";
import type { ListOrientation } from "./List.context";

export interface ListProps extends ViewProps {
    children?: ReactNode;

    color?: Color | ColorLike;
    variant?: "plain" | "outlined" | "soft" | "solid";
    size?: Size | SizeValue | number;

    orientation?: ListOrientation;

    marker?: any;
}
