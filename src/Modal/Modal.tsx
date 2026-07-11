import styled from "@emotion/native";
import {
    forwardRef,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    BackHandler,
    Pressable,
    Modal as RNModal,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { IconButton } from "../IconButton/IconButton";
import type { ModalProps } from "./Modal.types";

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;
const CLOSE_DURATION_MS = 220;
const CLOSE_FALLBACK_MS = 400;
const SPRING_CONFIG = {
    damping: 22,
    stiffness: 240,
    mass: 0.85,
};

let openModalCount = 0;

export function hasOpenModals() {
    return openModalCount > 0;
}

const ModalRootView = styled.View<{ layout: "center" | "fullscreen" }>(
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
                  alignItems: "stretch",
              }),
    }),
);

const BACKDROP_COLOR = "rgba(0,0,0,0.35)";

const ModalContainer = styled.View<{
    layout: "center" | "fullscreen";
    height?: number;
}>(({ layout, height }) => {
    if (layout === "center") {
        return {
            position: "relative",
            width: "100%",
            maxWidth: 720,
            maxHeight: "100%",
            overflow: "hidden",
            alignSelf: "center",
            ...(height != null ? { height } : {}),
        };
    }

    return {
        position: "relative",
        width: "100%",
        alignSelf: "stretch",
        flex: 1,
    };
});

const ModalContent = styled.View<{
    layout: "center" | "fullscreen";
    height?: number;
}>(({ layout, height }) => {
    if (layout === "center") {
        return {
            width: "100%",
            minHeight: 0,
            position: "relative",
            overflow: "hidden",
            ...(height != null ? { height } : {}),
        };
    }

    return {
        width: "100%",
        minHeight: 0,
        position: "relative",
        alignSelf: "stretch",
        flex: 1,
    };
});

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
            onExited,

            style,
            ...props
        },
        ref,
    ) => {
        const { t } = useTranslation("common");
        const closeModalLabel = t("a11y.closeModal", {
            defaultValue: "Close modal",
        });
        const visible = open;
        const canClose = Boolean(onClose);
        const { height: windowHeight } = useWindowDimensions();
        const [mounted, setMounted] = useState(visible);
        const animationGeneration = useRef(0);
        const onCloseRef = useRef(onClose);
        const onExitedRef = useRef(onExited);
        const wasVisibleRef = useRef(visible);
        const closingRef = useRef(false);
        const closeFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(
            null,
        );
        onCloseRef.current = onClose;
        onExitedRef.current = onExited;

        const translateY = useSharedValue(windowHeight);
        const backdropOpacity = useSharedValue(0);
        const dragStartY = useSharedValue(0);

        const clearCloseFallback = useCallback(() => {
            if (closeFallbackRef.current != null) {
                clearTimeout(closeFallbackRef.current);
                closeFallbackRef.current = null;
            }
        }, []);

        const settleExited = useCallback(() => {
            clearCloseFallback();
            closingRef.current = false;
            setMounted(false);
            onExitedRef.current?.();
        }, [clearCloseFallback]);

        const animateOpen = useCallback(() => {
            clearCloseFallback();
            closingRef.current = false;
            animationGeneration.current += 1;
            translateY.value = windowHeight;
            backdropOpacity.value = 0;
            translateY.value = withSpring(0, SPRING_CONFIG);
            backdropOpacity.value = withSpring(1, SPRING_CONFIG);
        }, [backdropOpacity, clearCloseFallback, translateY, windowHeight]);

        const animateClose = useCallback(
            (onComplete?: () => void) => {
                if (closingRef.current) return;
                closingRef.current = true;

                const generation = animationGeneration.current + 1;
                animationGeneration.current = generation;

                let completed = false;
                const complete = () => {
                    if (
                        completed ||
                        animationGeneration.current !== generation
                    ) {
                        return;
                    }
                    completed = true;
                    onComplete?.();
                };

                translateY.value = withTiming(
                    windowHeight,
                    { duration: CLOSE_DURATION_MS },
                    (finished) => {
                        if (
                            !finished ||
                            animationGeneration.current !== generation
                        ) {
                            return;
                        }
                        runOnJS(complete)();
                    },
                );
                backdropOpacity.value = withTiming(0, {
                    duration: CLOSE_DURATION_MS,
                });

                // Guarantee unmount even if the animation callback is dropped —
                // otherwise a transparent RNModal can block touches forever.
                clearCloseFallback();
                closeFallbackRef.current = setTimeout(() => {
                    complete();
                }, CLOSE_FALLBACK_MS);
            },
            [backdropOpacity, clearCloseFallback, translateY, windowHeight],
        );

        const requestClose = useCallback(() => {
            if (!canClose || closingRef.current) return;
            // Parent sets open=false; the open=false effect runs the exit animation.
            onCloseRef.current?.();
        }, [canClose]);

        const showBackdrop = !hideBackdrop;
        const backdropDismissible =
            showBackdrop && canClose && !disableBackdropClick;
        const isFullscreen = layout === "fullscreen";

        useEffect(() => {
            if (visible) {
                wasVisibleRef.current = true;
                closingRef.current = false;
                setMounted(true);
                return;
            }

            if (!wasVisibleRef.current || !mounted) return;
            wasVisibleRef.current = false;
            animateClose(settleExited);
        }, [animateClose, mounted, settleExited, visible]);

        useLayoutEffect(() => {
            if (!mounted || !visible || closingRef.current) return;
            animateOpen();
        }, [animateOpen, mounted, visible, windowHeight]);

        useEffect(() => {
            if (!mounted) return;

            openModalCount += 1;
            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    if (!canClose) return false;
                    requestClose();
                    return true;
                },
            );

            return () => {
                openModalCount = Math.max(0, openModalCount - 1);
                subscription.remove();
            };
        }, [canClose, mounted, requestClose]);

        useEffect(() => {
            return () => {
                clearCloseFallback();
            };
        }, [clearCloseFallback]);

        const panGesture = Gesture.Pan()
            .enabled(canClose && !disableBackdropClick)
            .activeOffsetY(8)
            .failOffsetX([-20, 20])
            .onStart(() => {
                dragStartY.value = translateY.value;
            })
            .onUpdate((event) => {
                const nextY = Math.max(0, dragStartY.value + event.translationY);
                translateY.value = nextY;
                backdropOpacity.value = Math.max(
                    0,
                    1 - nextY / (windowHeight * 0.45),
                );
            })
            .onEnd((event) => {
                const shouldDismiss =
                    translateY.value > DISMISS_DISTANCE ||
                    event.velocityY > DISMISS_VELOCITY;

                if (shouldDismiss) {
                    runOnJS(requestClose)();
                    return;
                }

                translateY.value = withSpring(0, SPRING_CONFIG);
                backdropOpacity.value = withSpring(1, SPRING_CONFIG);
            });

        const backdropStyle = useAnimatedStyle(() => ({
            opacity: backdropOpacity.value,
        }));

        const modalStyle = useAnimatedStyle(() => ({
            transform: [{ translateY: translateY.value }],
        }));

        if (!mounted && !keepMounted) return null;

        const modalBody = (
            <ModalRootView layout={layout} style={style} {...props}>
                {showBackdrop ? (
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            StyleSheet.absoluteFill,
                            backdropStyle,
                            { backgroundColor: BACKDROP_COLOR },
                        ]}
                    />
                ) : null}

                {backdropDismissible && layout === "center" ? (
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={requestClose}
                        accessibilityLabel={closeModalLabel}
                    />
                ) : null}

                <GestureDetector gesture={panGesture}>
                    <Animated.View
                        pointerEvents="box-none"
                        style={[
                            {
                                width: "100%",
                                alignSelf: "stretch",
                                ...(isFullscreen ? { flex: 1 } : {}),
                            },
                            modalStyle,
                        ]}
                    >
                        {backdropDismissible && isFullscreen ? (
                            <Pressable
                                style={StyleSheet.absoluteFill}
                                onPress={requestClose}
                                accessibilityLabel={closeModalLabel}
                            />
                        ) : null}

                        <ModalContainer
                            ref={ref}
                            layout={layout}
                            height={height}
                            pointerEvents="box-none"
                        >
                            {showCloseButton &&
                                (disableBackdropClick || canClose) &&
                                (closeButton ?? (
                                    <CloseButton
                                        color="neutral"
                                        variant="plain"
                                        layout={layout}
                                        onPress={requestClose}
                                        disabled={!canClose}
                                        accessibilityLabel={closeModalLabel}
                                    >
                                        <CloseGlyph layout={layout}>
                                            ✕
                                        </CloseGlyph>
                                    </CloseButton>
                                ))}

                            <ModalContent
                                layout={layout}
                                height={height}
                                pointerEvents="box-none"
                            >
                                {children}
                            </ModalContent>
                        </ModalContainer>
                    </Animated.View>
                </GestureDetector>
            </ModalRootView>
        );

        return (
            <RNModal
                visible={mounted}
                transparent
                animationType="none"
                onRequestClose={requestClose}
            >
                {layout === "center" ? (
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                        automaticOffset
                    >
                        {modalBody}
                    </KeyboardAvoidingView>
                ) : (
                    modalBody
                )}
            </RNModal>
        );
    },
);

Modal.displayName = "Modal";

export { Modal, ModalRootView as ModalRoot };
