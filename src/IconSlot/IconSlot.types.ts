import type { ReactElement, ReactNode } from "react";
import type { ViewProps } from "react-native";

export interface IconSlotProps extends ViewProps {
    /**
     * Fixed box size in pixels. When set, passes `size` to a single icon child.
     */
    size?: number;
    children: ReactNode;
}

export type IconSlotChild = ReactElement<{ size?: number | string }>;
