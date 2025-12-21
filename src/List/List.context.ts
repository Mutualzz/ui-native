import type {
    Color,
    ColorLike,
    Size,
    SizeValue,
    Variant,
} from "@mutualzz/ui-core";
import { createContext } from "react";

export type ListOrientation = "vertical" | "horizontal";

export type ListContextValue = {
    color?: Color | ColorLike;
    variant?: Variant;
    size?: Size | SizeValue | number;
    orientation?: ListOrientation;
    nesting: number;
    marker?: any;
};

export const ListContext = createContext<ListContextValue>({
    nesting: 0,
});
