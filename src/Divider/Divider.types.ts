import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    TypographyLevel,
} from "@mutualzz/ui-core";
import type { ViewProps } from "react-native";

export type DividerOrientation = "horizontal" | "vertical";

export type DividerInset = "none" | "start" | "end" | "half-start" | "half-end";

export type DividerVariant = "solid" | "dashed" | "dotted";

export interface DividerProps extends ViewProps {
    orientation?: DividerOrientation;
    inset?: DividerInset;

    lineColor?: Color | ColorLike;
    textColor?: Color | ColorLike;

    variant?: DividerVariant;

    textPadding?: Size | SizeValue | number;
    textLevel?: TypographyLevel;
}
