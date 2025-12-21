import type {
    Color,
    ColorLike,
    Orientation,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { createContext } from "react";

export interface CheckboxGroupContextType {
    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;
    orientation?: Orientation;
    name?: string;
    value?: string[];
    disabled?: boolean;

    toggle?: (val: string, checked: boolean) => void;

    onChange?: (event: unknown, value: string[]) => void;
}

export const CheckboxGroupContext =
    createContext<CheckboxGroupContextType | null>(null);
