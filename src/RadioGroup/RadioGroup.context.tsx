import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { createContext } from "react";

export interface RadioGroupContextType {
    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;
    orientation?: Orientation;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

export const RadioGroupContext = createContext<RadioGroupContextType | null>(
    null,
);
