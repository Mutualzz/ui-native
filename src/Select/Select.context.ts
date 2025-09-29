import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { createContext } from "react";
import type { SelectProps } from "./Select.types";

export interface SelectContextValue {
    value: SelectProps["value"];
    multiple?: boolean;
    onSelect: (value: string | number) => void;
    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;
    disabled?: boolean;
}

export const SelectContext = createContext<SelectContextValue | null>(null);
