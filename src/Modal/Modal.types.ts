import type { ReactNode } from "react";
import type { ViewProps } from "react-native";

export interface ModalProps extends ViewProps {
    open: boolean;

    children?: ReactNode;

    keepMounted?: boolean;

    layout?: "center" | "fullscreen";
    height?: number;

    hideBackdrop?: boolean;
    disableBackdropClick?: boolean;

    showCloseButton?: boolean;
    closeButton?: ReactNode;

    onClose?: () => void;
}
