import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";
import type { ViewProps } from "react-native";

export type Rect = { x: number; y: number; width: number; height: number };

export type TooltipPlacement =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";

export type TooltipVariant = Variant | "none";

export interface TooltipProps extends Omit<ViewProps, "children"> {
    title?: ReactNode;
    content?: ReactNode;
    children?: ReactNode;

    placement?: TooltipPlacement;

    open?: boolean;
    defaultOpen?: boolean;

    onHover?: (open: boolean) => void;

    enterDelay?: number;
    leaveDelay?: number;

    disableTouchListener?: boolean;

    id?: string;

    color?: Color | ColorLike;
    variant?: TooltipVariant;
    size?: Size | SizeValue | number;
    elevation?: number;

    offset?: number;
}
