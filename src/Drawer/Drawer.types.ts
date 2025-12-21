import type { Color, ColorLike, Size, SizeValue } from "@mutualzz/ui-core";
import type { ViewProps } from "react-native";
import type { PaperVariant } from "../Paper/Paper.types";

export type DrawerAnchor = "left" | "right" | "top" | "bottom";
export type DrawerConsistency = "permanent" | "temporary";

export interface DrawerProps extends ViewProps {
    color?: Color | ColorLike;
    variant?: PaperVariant;
    size?: Size | SizeValue | number;

    elevation?: number;

    anchor?: DrawerAnchor;
    hideBackdrop?: boolean;

    onOpen: () => void;
    onClose: () => void;
    open: boolean;

    consistency?: DrawerConsistency;

    swipeable?: boolean;

    disablePortal?: boolean;

    transparency?: number;

    swipeArea?: number | Size | SizeValue;
    threshold?: number | Size | SizeValue;
}
