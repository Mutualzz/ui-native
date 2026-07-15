import {
    BottomSheetModal,
    BottomSheetView,
    type BottomSheetModal as BottomSheetModalRef,
} from "@expo/ui/community/bottom-sheet";
import { useTheme } from "../useTheme";
import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, type View as RNView } from "react-native";
import type { SheetProps } from "./Sheet.types";

let openSheetCount = 0;

export function hasOpenSheets() {
    return openSheetCount > 0;
}

const SheetInner = forwardRef<RNView, SheetProps>(function SheetInner(
    {
        children,
        open,
        layout = "center",
        height,
        snapPoints: snapPointsProp,
        enableDynamicSizing: enableDynamicSizingProp,
        disableBackdropClick = false,
        showCloseButton = true,
        showHandle = true,
        closeButton,
        onClose,
        onExited,
        style,
    },
    _ref,
) {
    const { t } = useTranslation("common");
    const { theme } = useTheme();
    const sheetRef = useRef<BottomSheetModalRef>(null);
    const openRef = useRef(open);
    openRef.current = open;
    const onCloseRef = useRef(onClose);
    const onExitedRef = useRef(onExited);
    onCloseRef.current = onClose;
    onExitedRef.current = onExited;
    const presentedRef = useRef(false);
    const exitedRef = useRef(false);
    const canClose = Boolean(onClose);

    const fillSheet =
        snapPointsProp != null ||
        layout === "fullscreen" ||
        height != null ||
        enableDynamicSizingProp === false;

    const enableDynamicSizing = enableDynamicSizingProp ?? !fillSheet;

    const snapPoints = useMemo(() => {
        if (snapPointsProp != null) return snapPointsProp;
        if (height != null) return [height];
        if (layout === "fullscreen") return ["92%"];
        return undefined;
    }, [height, layout, snapPointsProp]);

    useEffect(() => {
        if (!open) return;
        openSheetCount += 1;
        return () => {
            openSheetCount = Math.max(0, openSheetCount - 1);
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            exitedRef.current = false;
            presentedRef.current = true;
            const frame = requestAnimationFrame(() => {
                sheetRef.current?.present();
            });
            return () => cancelAnimationFrame(frame);
        }

        if (presentedRef.current) {
            sheetRef.current?.dismiss();
        }
    }, [open]);

    const requestClose = useCallback(() => {
        if (!canClose) return;
        onCloseRef.current?.();
    }, [canClose]);

    const handleDismiss = useCallback(() => {
        if (exitedRef.current) return;
        exitedRef.current = true;
        presentedRef.current = false;
        const stillWantOpen = openRef.current;
        queueMicrotask(() => {
            if (stillWantOpen) {
                onCloseRef.current?.();
            }
            onExitedRef.current?.();
        });
    }, []);

    return (
        <BottomSheetModal
            ref={sheetRef}
            snapPoints={snapPoints}
            enableDynamicSizing={enableDynamicSizing}
            enablePanDownToClose={canClose && !disableBackdropClick}
            onDismiss={handleDismiss}
            handleComponent={showHandle ? undefined : null}
            backgroundStyle={{ backgroundColor: theme.colors.background }}
            handleIndicatorStyle={
                showHandle
                    ? { backgroundColor: "rgba(128,128,128,0.55)" }
                    : undefined
            }
        >
            <BottomSheetView
                style={[
                    styles.content,
                    fillSheet
                        ? {
                              flex: 1,
                              backgroundColor: "transparent",
                          }
                        : {
                              backgroundColor: theme.colors.background,
                          },
                    style,
                ]}
            >
                {showCloseButton && canClose
                    ? (closeButton ?? (
                          <Pressable
                              onPress={requestClose}
                              hitSlop={8}
                              accessibilityLabel={t("a11y.closeModal", {
                                  defaultValue: "Close modal",
                              })}
                              style={styles.closeButton}
                          >
                              <Text style={styles.closeGlyph}>✕</Text>
                          </Pressable>
                      ))
                    : null}
                {children}
            </BottomSheetView>
        </BottomSheetModal>
    );
});

export const Sheet = SheetInner;

const styles = StyleSheet.create({
    content: {
        width: "100%",
        overflow: "hidden",
    },
    closeButton: {
        alignSelf: "flex-end",
        marginTop: 4,
        marginRight: 8,
        marginBottom: 4,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    closeGlyph: {
        fontSize: 16,
        fontWeight: "700",
    },
});
