import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import type { ReactNode } from "react";

export interface RadioGroupProps {
    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;

    name?: string;

    value?: any;
    defaultValue?: any;

    onChange?: (value: any) => void;

    disabled?: boolean;

    orientation?: Orientation;
    spacing?: Size | SizeValue | number;

    children: ReactNode;
}
