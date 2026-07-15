import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export interface SheetProps {
    open: boolean;
    children?: ReactNode;
    keepMounted?: boolean;
    layout?: "center" | "fullscreen";
    height?: number;
    snapPoints?: (string | number)[];
    enableDynamicSizing?: boolean;
    hideBackdrop?: boolean;
    disableBackdropClick?: boolean;
    showCloseButton?: boolean;
    showHandle?: boolean;
    closeButton?: ReactNode;
    onClose?: () => void;
    onExited?: () => void;
    style?: StyleProp<ViewStyle>;
}
