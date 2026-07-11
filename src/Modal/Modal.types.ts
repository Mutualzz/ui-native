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

    /** User requested dismiss (backdrop / back / swipe). Parent should set `open` to false. */
    onClose?: () => void;
    /** Fired after the close animation finishes and the modal has unmounted. */
    onExited?: () => void;
}
