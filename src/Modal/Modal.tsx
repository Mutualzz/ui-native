import styled from "@emotion/native";
import { forwardRef, useMemo } from "react";
import { Pressable, Modal as RNModal, View } from "react-native";
import { IconButton } from "../IconButton/IconButton";
import type { ModalProps } from "./Modal.types";

const ModalRoot = styled.View<{ layout: "center" | "fullscreen" }>(
    ({ layout }) => ({
        flex: 1,

        ...(layout === "center"
            ? {
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 32,
              }
            : {
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
              }),
    }),
);

const ModalBackdrop = styled(Pressable)({
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
});

const ModalContainer = styled.View<{
    layout: "center" | "fullscreen";
    height?: number;
}>(({ layout, height }) => ({
    position: "relative",
    ...(layout === "center"
        ? {
              width: "100%",
              maxWidth: 720,
              maxHeight: "100%",
              overflow: "hidden",
              height: height,
              alignSelf: "center",
          }
        : {
              width: "100%",
              height: "100%",
          }),
}));

const ModalContent = styled.View<{
    layout: "center" | "fullscreen";
    height?: number;
}>(({ layout, height }) => ({
    width: "100%",
    minHeight: 0,
    position: "relative",
    ...(layout === "center"
        ? {
              height: height,
              overflow: "hidden",
          }
        : {
              height: "100%",
          }),
}));

const CloseButton = styled(IconButton)<{ layout: "center" | "fullscreen" }>(
    ({ layout }) => ({
        alignSelf: "flex-end",
        marginTop: layout === "fullscreen" ? 48 : 24,
        marginRight: layout === "fullscreen" ? 48 : 24,
        marginBottom: -48,
        zIndex: 1,
        borderRadius: 16,
        width: layout === "fullscreen" ? 44 : 40,
        height: layout === "fullscreen" ? 44 : 40,
        padding: 0,
        alignItems: "center",
        justifyContent: "center",
    }),
);

const CloseGlyph = styled.Text<{ layout: "center" | "fullscreen" }>(
    ({ layout }) => ({
        fontSize: layout === "fullscreen" ? 18 : 16,
        lineHeight: layout === "fullscreen" ? 18 : 16,
        fontWeight: "700",
    }),
);

const Modal = forwardRef<View, ModalProps>(
    (
        {
            children,
            open,
            keepMounted = false,
            layout = "center",
            height,
            hideBackdrop = false,
            disableBackdropClick = false,
            showCloseButton = true,
            closeButton,
            onClose,

            style,
            ...props
        },
        ref,
    ) => {
        const visible = open;

        if (!visible && !keepMounted) return null;

        const canClose = Boolean(onClose);

        const backdrop = useMemo(() => {
            if (hideBackdrop) return null;

            if (disableBackdropClick || !canClose) {
                return <ModalBackdrop disabled />;
            }

            return <ModalBackdrop onPress={onClose} />;
        }, [hideBackdrop, disableBackdropClick, canClose, onClose]);

        return (
            <RNModal visible={visible} transparent animationType="fade">
                <ModalRoot layout={layout} style={style} {...props}>
                    {backdrop}

                    <ModalContainer ref={ref} layout={layout} height={height}>
                        {showCloseButton &&
                            (disableBackdropClick || canClose) &&
                            (closeButton ?? (
                                <CloseButton
                                    color="neutral"
                                    variant="plain"
                                    layout={layout}
                                    onPress={onClose}
                                    disabled={!canClose}
                                    accessibilityLabel="Close modal"
                                >
                                    <CloseGlyph layout={layout}>✕</CloseGlyph>
                                </CloseButton>
                            ))}

                        <ModalContent layout={layout} height={height}>
                            {children}
                        </ModalContent>
                    </ModalContainer>
                </ModalRoot>
            </RNModal>
        );
    },
);

Modal.displayName = "Modal";

export { Modal, ModalBackdrop, ModalRoot };
